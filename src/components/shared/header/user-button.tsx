import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { SignOutButton } from '@/features/auth/components/sign-out-button';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex gap-2">
        <Button asChild size="lg">
          <Link href="/sign-in">
            <UserIcon /> Sign In
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/sign-up">
            <UserIcon /> Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm leading-none font-medium">
                {session.user?.name}
              </div>
              <div className="text-sm leading-none text-muted-foreground">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard" className="w-full">
              Dashboard
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="mb-1 p-0">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
