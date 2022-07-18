import Image from "next/image";
import Link from "next/link";

import style from './header.module.scss'

export default function Header() {
  return (
    <header className={style.header}>
          <Link href={'/'}>
            <Image
              src={'/Logo.svg'}
              alt="Logo"
              width={236.62}
              height={25.63}
            />
          </Link>
    </header>
  )
}
