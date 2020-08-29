import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: <>Stream-based State Management</>,
    imageUrl: "img/decoration1.svg",
    description: (
      <>Stream systems describe UI logic in a natural, declarative form.</>
    ),
  },
  {
    title: <>Framework Agnostic. Fit for React</>,
    imageUrl: "img/decoration2.svg",
    description: (
      <>Expose stream systems as React components. No more hook spaghetti.</>
    ),
  },
  {
    title: <>Compatible with Your Reality</>,
    imageUrl: "img/decoration3.svg",
    description: (
      <>
        Play it safe and port a few pieces of your code to urx. Keep your
        existing state management for the rest.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Stream-Based Rective State Management Library`}
      description="urx is a tiny reactive state management library, designed for complex, multi-input/output systems"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            <img src="img/logo.svg" alt="urx" style={{ height: 334 / 2 }} />
          </h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
