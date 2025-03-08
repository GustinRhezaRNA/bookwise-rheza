import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from '@/auth';
import { Button } from './ui/button';

const Header = ({ session }: { session: Session }) => {
 
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href={'/'}>
        <Image
          src={'/icons/logo.svg'}
          alt={'logo'}
          width={40}
          height={40}
        />
      </Link>
      <ul className="flex gap-5 items-center">
        
        <li>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <Button>Logout</Button>
          </form>
          {/* <Link href={'/my-profile'}>
            <Avatar>
              <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name || 'HI')}</AvatarFallback>
            </Avatar>
          </Link> */}
        </li>
      </ul>
    </header>
  );
};

export default Header;
