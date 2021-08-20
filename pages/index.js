import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Nav from "../components/nav";
import axios from "axios";
import trim from "short-number";
import styles from "../styles/landingPage.module.scss";

export const getServerSideProps = async () => {
  const response = await axios.get(
    "https://corona.lmao.ninja/v2/countries/Rwanda?yesterday=true&strict=false&query=20"
  );
  return {
    props: {
      initialData: response.data || {},
    },
  };
};

const LandingPage = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState();
  const [input, setInput] = useState(initialData.country);
  const [date, setDate] = useState();
  const [data, setData] = useState(initialData);
  const [continentalData, setContinetalData] = useState();

  let scrollOffset;
  const scrollableDiv = useRef(null);
  const widthRef = useRef(null);
  const dateRef = useRef(null);
  scrollOffset = widthRef.current?.offsetWidth;

  const getCountries = async () => {
    const response = await axios.get(
      `https://corona.lmao.ninja/v2/countries?yesterday&sort=`
    );
    setCountries(response.data);
  };

  const searchCountry = async () => {
    if (!date) {
      dateRef.current.style.border = "2px solid red";
    } else {
      dateRef.current.style.border = "inherit";
      setLoading(true);
      const response = await axios.get(
        `https://corona.lmao.ninja/v2/countries/${input}?yesterday=true&strict=false&query=20`
      );
      setData(response.data);
      setLoading(false);
    }
  };

  const getContinents = async () => {
    const response = await axios.get(
      "https://corona.lmao.ninja/v2/continents?yesterday=true&sort"
    );
    setContinetalData(response.data);
  };

  const scroll = (scrollOffset) => {
    scrollableDiv.current.scrollLeft += scrollOffset;
  };

  useEffect(() => {
    getContinents();
    getCountries();
  }, []);

  return (
    <div className={styles.parent}>
      <div
        style={{ display: loading ? "flex" : "none" }}
        className={styles.loading}
      >
        Loading ...
      </div>
      <section className={styles.sectionOne}>
        <Nav />
        <div className={styles.search}>
          <div className={styles.title}>UPDATES</div>
          <div className={styles.description}>Search a country</div>
          <div className={styles.textbox}>
            <div className={styles.drop}>
              <div className={styles.icon}>
                <Image
                  src={data.countryInfo.flag}
                  objectFit="cover"
                  layout="fill"
                  alt="flag"
                />
              </div>
              <div>
                <select
                  value={input}
                  id="country"
                  name="country"
                  onChange={(e) => setInput(e.target.value)}
                >
                  {countries?.map((data, index) => {
                    return (
                      <option key={index} value={data.country}>
                        {data.country}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <input
              ref={dateRef}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              id="birthday"
              name="birthday"
            />
            <button onClick={() => searchCountry()}>
              {loading ? "..." : "SUBMIT"}
            </button>
          </div>
        </div>
        <div className={styles.results}>
          <div className={styles.cumulatively}>
            <h1>{data.tests}</h1>
            <p>Cumulatively</p>
          </div>
          <div className={styles.otherInfos}>
            <div className={styles.info}>
              <h2>{trim(data.cases)}</h2>
              <h3>Tests</h3>
              <p>{trim(data.testsPerOneMillion)}</p>
            </div>
            <div className={styles.info}>
              <h2>{trim(data.active)}</h2>
              <h3>Positive cases</h3>
              <p>{trim(data.cases)}</p>
            </div>
            <div className={styles.info}>
              <h2>{trim(data.active)}</h2>
              <h3>Hospitalized</h3>
              <p>{trim(data.oneCasePerPeople)}</p>
            </div>
            <div className={styles.info}>
              <h2>{trim(data.recovered)}</h2>
              <h3>Recovered</h3>
              <p>{trim(2, 188, 881)}</p>
            </div>
            <div className={styles.info}>
              <h2>{trim(data.deaths)}</h2>
              <h3>Deaths</h3>
              <p>{trim(data.todayDeaths)}</p>
            </div>
            <div className={styles.info}>
              <h2>{trim(11, 270)}</h2>
              <h3>Vaccinated</h3>
              <p>{trim(data.recoveredPerOneMillion)}</p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.sectionTwo}>
        <h1>PER CONTINENTS</h1>
        <div className={styles.sliderHolder}>
          <div
            onClick={() => scroll(-scrollOffset - 20)}
            className={styles.nextArrow}
          >
            {"<"}
          </div>
          <div
            onClick={() => scroll(scrollOffset + 20)}
            className={styles.prevArrow}
          >
            {">"}
          </div>
          <div ref={scrollableDiv} className={styles.infoBoxContainer}>
            {continentalData?.map((el, index) => {
              return (
                <div key={index} ref={widthRef} className={styles.infoBox}>
                  <div className={styles.tabOne}>
                    <h1>{el.continent}</h1>
                    <div>
                      <h1>{el.todayCases}</h1>
                      <span>New cases</span>
                    </div>
                    <h3>{`All cases: ${el.cases}`}</h3>
                  </div>
                  <div className={styles.tabTwo}>
                    <div>
                      <h1>{el.todayDeaths}</h1>
                      <span>New deaths</span>
                      <h3>{`All deaths: ${el.deaths}`}</h3>
                    </div>
                    <div>
                      <h1>{el.todayRecovered}</h1>
                      <span>New recovered</span>
                      <h3>{`All recovered: ${el.recovered}`}</h3>
                    </div>
                    <div>
                      <h1>{el.tests}</h1>
                      <span>New vaccinated</span>
                      <h3>{`All vaccinated: ${el.testsPerOneMillion}`}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className={styles.sectionThree}>
        <div className={styles.profile}>
          <img src="/profile.JPG" alt="profile" />
        </div>
        <div className={styles.skill}>
          <h1>KUNDWA BRUNO M.</h1>
          <h2>Full stack developer</h2>
          <p>19 August 2021</p>
        </div>
      </section>
      <section className={styles.sectionFour}>
        <div className={styles.footerOne}>
          <h1>REACH ME</h1>
          <div>
            <h2>Email</h2>
            <p>[ kundwabruno@gmail.com ]</p>
          </div>
          <div>
            <h2>Phone</h2>
            <p>[ +250 789 070 593 ]</p>
          </div>
          <div>
            <h2>Profile</h2>
            <p>
              <a
                href="https://www.itskbm.com/"
                target="_blank"
                rel="noreferrer"
              >
                [ Click me ]
              </a>
            </p>
          </div>
        </div>
        <div className={styles.footerTwo}>
          <div>
            Developed by <span>Kundwa Bruno M.</span>
          </div>
          <div>
            Designed by <span>Awesomity Lab</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
