// page.tsx

import { Metadata } from "next";
import utilStyles from "@/styles/utils.module.css";
import Link from "next/link";
import Layout from "@/components/layout";

export const metadata: Metadata = {
  title: "GCP Assistant Bot",
};

export default function Page() {
  const FunctionList = [
    {
      page_path: "/pages/chat_bot",
      title: "Bot Assistant",
      description:
        "Navigate and manage your GCP resources with ease using our Bot Assistant, ready to provide real-time insights and optimizations.",
    },
    {
      page_path: "/pages/stress-test",
      title: "Simulate High-Load Scenarios",
      description:
        "Perform stress tests on your Cloud Run service with customizable concurrent requests.",
    },
    {
      page_path: "/pages/system_metric",
      title: "Fetch System Metrics",
      description:
        "Quickly access and analyze detailed system metrics from GCP with our integrated Monitoring API.",
    },
  ];

  return (
    <Layout home={true}>
      <section className={utilStyles.headingMd}>
        <p>
          Meet the GCP Assistant Bot, your efficient guide to managing GCP
          resources and optimizing performance.
        </p>
        {/* <p>
          Hi! I'm GCP Assistant Bot, your intelligent digital partner designed
          to empower you in effortlessly managing and optimizing your Google
          Cloud Platform resources. From providing real-time insights to
          adjusting settings for optimal performance, I'm here to ensure your
          GCP experience is seamless and efficient.
        </p> */}
        <br />
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>
          <strong>Function list</strong>
        </h2>
        <ul className={utilStyles.list}>
          {FunctionList.map(({ page_path, title, description }) => (
            <li className={utilStyles.listItem} key={page_path}>
              <Link href={`${page_path}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>{description}</small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
