import {
  HomeOutlined,
  LabelOutlined,
  ArchiveOutlined,
  DeleteOutlineOutlined,
  AccountCircleOutlined,
  Logout,
  Close,
  Add,
} from "@mui/icons-material/";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import { useAuth, useNotes } from "../../context";
import { useState } from "react";
import { sidebarSections } from "./sidebar-sections";

const Sidebar = () => {
  const [newLabel, setNewLabel] = useState("");
  const Navigate = useNavigate();
  const { authDispatch, authUser, isAuth } = useAuth();
  const { notesDispatch, showSidebar, handleShowSidebar, labels } = useNotes();

  const labelMapping = labels.length > 0 && (
    <ul className="list list-spaced mt-0-5 list-style-none pl-2-5 list-labels flex-col align-center">
      {labels.map(({ label, id }) => (
        <li key={id} className="text-reg">
          {label}
        </li>
      ))}
    </ul>
  );
  const mappedSections = sidebarSections.map(({ key, icon, name, path }) => {
    return (
      <h6 key={key} className="aside-link-wrapper">
        <Link className="btn btn-link" to={path}>
          <span className="icon mui-icon aside-section-icon">{icon}</span>
          {name}
        </Link>
        {name === "Labels" && labelMapping}
      </h6>
    );
  });

  const handleCreateNote = () => {
    notesDispatch({
      action: {
        type: "SHOW_NEW_NOTE_FORM",
        payload: {
          showNewNoteForm: true,
          isEditing: null,
          editingNoteId: -1,
        },
      },
    });
  };

  const handleAddNewLabel = (event) => {
    event.preventDefault();
    notesDispatch({
      action: {
        type: "ADD_LABEL",
        payload: { label: newLabel, labelId: uuid() },
      },
    });
    setNewLabel("");
  };

  const handleLogout = () => {
    localStorage.removeItem("inscribe-token");
    localStorage.removeItem("inscribe-user");

    authDispatch({
      action: {
        type: "RESET_AUTH",
        payload: {
          authToken: "",
          isAuth: false,
          authLoading: false,
          authError: null,
          authUser: {},
        },
      },
    });
    Navigate("/login");
  };

  if (!isAuth) return null;

  const buttonDisabled =
    notesStateLoading || (notesStateError && "btn-disabled");

  return (
    <aside className="idebar flex-col flex-justify-between">
      {showSidebar && (
        <button
          className="btn btn-icon btn-sidebar-close"
          onClick={handleShowSidebar}
        >
          {<Close fontSize="large" />}
        </button>
      )}
      <section className="sidebar-nav-links flex-col">
        {mappedSections}
        <section className="labels-wrapper mt-1">
          <form className="input-label-form" onSubmit={handleAddNewLabel}>
            <div className="flex-row flex-align-center flex-justify-center input-label-wrapper">
              <input
                type="text"
                className="input-label p-0-5"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Enter new Label"
                disabled={notesStateError || notesStateLoading}
                required
              />
              <button
                type="submit"
                className={`btn btn-icon- btn-primary btn-label-submit ${buttonDisabled}`}
                disabled={notesStateError || notesStateLoading}
              >
                {<Add />}
              </button>
            </div>
          </form>
        </section>
        <button
          className={`btn btn-primary btn-new-note btn-full-width px-0-75 py-0-25 mt-1-5 text-reg ${buttonDisabled}`}
          onClick={handleCreateNote}
          disabled={notesStateError || notesStateLoading}
        >
          Create new note
        </button>
      </section>
      {notesStateError && !notesStateLoading ? null : (
        <section className="sidebar-footer flex-row flex-align-center flex-justify-between flex-wrap">
          <article className="user-info flex-row flex-align-center">
            <img></img>
            <p className="user-name-text-sm">
              {authUser.firstName} {authUser.lastName}
            </p>
          </article>
          <button className="btn btn-icon btn-logout" onClick={handleLogout}>
            <Logout />
          </button>
        </section>
      )}
    </aside>
  );
};

export { Sidebar };
