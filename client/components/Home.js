import Head from 'next/head'
import styles from './Home.module.scss'


import React from 'react'



export default class Home extends React.Component {
  constructor(props) {
    super(props);


  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  render() {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>顔工場</h2>
        <p className={styles.text}>
          <br />
          スペースキーでメニュー
          <br />
          Fでフルスクリーン表示（ESCで解除）
        </p>
      </div >
    )

  }
}
