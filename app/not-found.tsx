"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import utilStyles from "/styles/utils.module.css";
import styles from "/styles/layout.module.css";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={utilStyles.headingXl}>404 - Page Not Found</h1>
      <small className={utilStyles.lightText}>
        Redirecting to the homepage in 3 seconds...
      </small>
    </div>
  );
}
