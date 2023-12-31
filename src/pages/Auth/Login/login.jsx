import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "../auth.css";
import { loginService } from "../../../services";
import { useAuth } from "../../../context";

const Login = () => {

	const initialFormData = {
		email: "",
		password: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const { authState: { authError, authLoading, isAuth }, authDispatch } = useAuth();

    useEffect(() => {
        const { state } = location; 
		!authLoading && isAuth && navigate(state?.from ? state.from : '/');
	}, []);

	const handleFormDataChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const showPasswordIcon = showPassword ? (
		<VisibilityOffIcon />
	) : (
		<VisibilityIcon />
	);

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		try {
			const { data } = await loginService(formData);
			const {
				encodedToken,
				foundUser: { notes, archives, ...otherUserDetails },
			} = data;

			authDispatch({
				action: {
					type: "INIT_AUTH",
					payload: {
						isAuth: true,
						authToken: encodedToken,
						authUser: { ...otherUserDetails },
						authLoading: true,
						authError: null,
					},
				},
			});

			localStorage.setItem("inscribe-token", encodedToken);
			localStorage.setItem("inscribe-user", otherUserDetails);

			const timeoutId = setTimeout(() => {
				setFormData(initialFormData);

                authDispatch({
                    action: {
                        type: "INIT_AUTH",
                        payload: {
                            isAuth: true,
                            authToken: encodedToken,
                            authUser: { ...otherUserDetails },
                            authLoading: false,
                            authError: null,
                        },
                    },
                });

				location.state?.from
					? navigate(location.state.from)
					: navigate("/");
			}, 3000);
		} 
        catch (error) {
			localStorage.removeItem("inscribe-token");
			localStorage.removeItem("inscribe-user");
			authDispatch({
				action: {
					type: "INIT_AUTH",
					payload: {
						authUser: {},
						authToken: "",
						isAuth: false,
						authLoading: false,
						authError:
							"Login failed. Please try again after sometime.",
					},
				},
			});
		}
	};

	const { email, password } = formData;
	const handleChangePasswordVisibility = () =>
		setShowPassword((prevShowPassword) => !prevShowPassword);

	const handleLoginWithTestCredentials = (event) => {
		setFormData({
			email: "adarshbalika@gmail.com",
			password: "adarshBalika123",
		});
	};

    const btnDisabled = authLoading && 'btn-disabled';
    const linkDisabled = authLoading && 'link-disabled';

	return (
		<section className="section-wrapper auth-main flex-col flex-align-center flex-justify-start mx-auto p-3">
			<div className="auth-wrapper">
				<section className="auth-container login-container mx-auto mb-1 px-1-5">
					<h3 className="text-center text-uppercase auth-head mb-1">
						Login
					</h3>
					<form
						className="auth-form px-1 flex-col flex-align-center flex-justify-center"
						onSubmit={handleFormSubmit}
					>
						<div className="input-group input-default mt-1-5 mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto"
								htmlFor="input-login-email"
							>
								Email
								<input
									type="email"
									name="email"
									id="input-login-email"
									className="input-text text-sm px-0-75 py-0-5 mt-0-25"
									placeholder="janedoe@gmail.com"
									value={email}
									onChange={handleFormDataChange}
                                    disabled={authLoading}
									required
								/>
							</label>
							<span className="text-message mt-0-5"></span>
						</div>
						<div className="input-group input-default mt-1-5 mb-1 mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto text-sm"
								htmlFor="input-login-psd"
							>
								Password
								<span className="password-input-toggler">
									<input
										type={`${
											showPassword ? "text" : "password"
										}`}
										id="input-login-psd"
										className="input-text px-0-75 py-0-5 mt-0-25 text-sm"
										placeholder="********"
										name="password"
										value={password}
                                        disabled={authLoading}
										onChange={handleFormDataChange}
										autoComplete="off"
										required
									/>
									<button
										type="button"
										className="btn btn-icon icon-show-psd"
										onClick={handleChangePasswordVisibility}
                                        disabled={authLoading}
									>
										<span className="icon mui-icon">
											{showPasswordIcon}
										</span>
									</button>
								</span>
							</label>
							<span className="text-message mt-0-5"></span>
						</div>
						<div className="psd-mgmt-container mt-2 flex-row flex-align-center flex-justify-between flex-wrap">
							<label
								htmlFor="checkbox-remember"
								className="flex-row input-checkbox-remember flex-align-center text-sm"
							>
								<input
									type="checkbox"
									className="input-checkbox text-reg"
									id="checkbox-remember"
                                    disabled={authLoading}
								/>
								Remember me
							</label>
							<div className="btn btn-link btn-primary btn-forgot-psd text-sm">
								Forgot password?
							</div>
						</div>
						<div className="auth-button-container mt-1 flex-col flex-align-center">
							<div className="login-button-container flex-col flex-align-center flex-justify-center">
								<input
									type="submit"
									className={`btn btn-primary btn-full-width px-0-75 py-0-25 btn-full-width text-reg ${btnDisabled}`}
									value="Login"
                                    disabled={authLoading}
								/>
								<input
									type="submit"
									className={`btn btn-primary btn-outline btn-full-width px-0-75 py-0-25 btn-full-width text-reg ${btnDisabled}`}
									value="Login with Test Credentials"
									onClick={handleLoginWithTestCredentials}
                                    disabled={authLoading}
								/>
							</div>
							<Link
								to="/signup"
								className={`btn btn-link btn-primary mt-0-75 flex-row flex-justify-center flex-align-center ${linkDisabled}`}
							>
								Create a new account
								<span className="icon mui-icon icon-chevron-right">
									<ChevronRightIcon />
								</span>
							</Link>
						</div>
					</form>
				</section>
			</div>
			{authError && <p className="error-color text-lg">{authError}</p>}
            {authLoading && <p className="success-color text-lg"> Logging in. Please wait...</p>}
		</section>
	);
};

export { Login };