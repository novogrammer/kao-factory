import Link from 'next/link'
import React from 'react';
import styles from './MainLayout.module.scss'

import $ from "jquery";

export default function MainLayout({ children }) {
  const menuRef = React.useRef();
  React.useEffect(() => {
    // console.log("MainLayout useEffect");
    const menu = menuRef.current;
    const $menu = $(menu);

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
                <a>工場俯瞰（デバッグ用）</a>
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
            <li>
              <Link href="/factory/c/">
                <a>工場C</a>
              </Link>
            </li>
          </ul>
        </div>

      </header>
      {children}
    </>
  );
}