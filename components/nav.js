import styles from "../styles/nav.module.scss";

const Nav = () => {
  return (
    <div className={styles.main}>
      <div className={styles.name}>COVICALC</div>
      <div className={styles.buttonContainer}>
        <button>CONTACT</button>
      </div>
    </div>
  );
};

export default Nav;
