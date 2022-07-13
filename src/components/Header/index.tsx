import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href={"/"}>
          <Image
            alt="slsa"
            src="/Logo.svg"
            width="238.62"
            height="25.63"
          />
      </Link>
      sada
    </header>
  )
}
