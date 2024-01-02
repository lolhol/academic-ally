import { useState, useEffect } from "react";
import DropdownMenu from "../components/DropdownMenu";
import css from "../styles/testGenStyles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Gen() {
  return (
    <>
      <head></head>
      <body>
        <main>
          <div className={css.sidebarDiv}>
            <button
              type="button"
              className="btn btn-secondary btn-lg btn-block"
            >
              Block level button
            </button>
            <ul className="list-group">
              <li className="list-group-item active">One</li>
              <li className="list-group-item">Two</li>
              <li className="list-group-item">Morbi leo risus</li>
              <li className="list-group-item">Porta ac consectetur ac</li>
              <li className="list-group-item">Vestibulum at eros</li>
            </ul>
          </div>
        </main>
      </body>
    </>
  );
}
