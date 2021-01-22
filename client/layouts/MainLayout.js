import Link from 'next/link'
import React from 'react';
import styles from './MainLayout.module.scss'

import $ from "jquery";

import LogTextContext from "../context/LogTextContext";

export default function MainLayout({ children }) {
  const menuRef = React.useRef();
  const [logText, setLogText] = React.useState("");

  const logTextContext = {
    addLogText: (text) => {
      setLogText((prevLogText) => {
        console.log(text);
        return prevLogText + text + "\n";
      });
    },
    clearLogText: () => {
      setLogText((prevLogText) => {
        return "";
      });
      console.log("clear");
    },
  };

  React.useEffect(() => {
    // console.log("MainLayout useEffect");
    const menu = menuRef.current;
    const $menu = $(menu);
    // addLogText("b");

    const onKeyDown = (event) => {
      switch (event.key) {
        case " ":
          console.log("space");
          $menu.slideToggle();
          break;
        case "Escape":
          console.log("escape");
          $menu.slideUp();
          break;
      }
    }
    const onClickMenu = (event) => {
      $menu.slideUp();
    }
    document.addEventListener("keydown", onKeyDown);
    menu.addEventListener("click", onClickMenu);
    return () => {
      // console.log("MainLayout useEffect finalize");
      document.removeEventListener("keydown", onKeyDown);
      menu.removeEventListener("click", onClickMenu);
    };
  });
  return (
    <>
      <header>
        <div className={styles["menu-container"]} ref={menuRef}>
          <ul>
            <li>
              <Link href="/">
                <a>home</a>
              </Link>
            </li>
            <li>
              <Link href="/entry/">
                <a>顔登録</a>
              </Link>
            </li>
            <li>
              <Link href="/factory/">
                <a>工場俯瞰</a>
              </Link>
            </li>
            <li>
              <Link href="/factory/a/">
                <a>工場A</a>
              </Link>
            </li>
            <li>
              <Link href="/factory/b/">
                <a>工場B</a>
              </Link>
            </li>
          </ul>
        </div>

      </header>
      <LogTextContext.Provider value={logTextContext}>
        {children}
      </LogTextContext.Provider>
      <footer>
        <div className={styles["log-container"]}>
          <p className={styles["log-text"]}>{logText}</p>
        </div>
      </footer>
    </>
  );
}