import Link from "next/link";

export default function Page() {
  return (
    <main style={{
      backgroundColor: 'lightgray',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid black',
      paddingBottom: '20px',
    }}>
      <h1 style={{
        font: '40px bold Arial, Helvetica, sans-serif',
      }}>SMITE Prometheus</h1>
      <Link href="/hunters">
        <span>Hunters</span> {/* <ArrowRightIcon className="w-5 md:w-6" /> */}
      </Link>
    </main>
  );
}
