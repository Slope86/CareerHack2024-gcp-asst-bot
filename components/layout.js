import Image from "next/image";
import styles from "@/styles/layout.module.css";
import utilStyles from "@/styles/utils.module.css";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const name = "GCP Assistant Bot";
export const siteTitle = "GCP control web";

export default function Layout({ children, home = false }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-0 mt-12 mb-24">
      <header className={styles.header}>
        <div className="fixed top-0 right-0 p-2.5">
          <UserButton />
        </div>
        {home ? (
          <>
            <Image
              priority
              src="/images/bot_small.png"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <Image
                priority
                src="/images/bot_small.png"
                className={utilStyles.borderCircle}
                height={108}
                width={108}
                alt=""
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to Home page</Link>
        </div>
      )}
    </div>
  );
}
