'use client';

import { CreditCard, Crown, Loader, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/auth-client';

export const UserButton = () => {
  const { data: session, isPending: loading } = authClient.useSession();

  const onClick = () => {
    console.log('Clicked');
    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    // mutation.mutate();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const name = session?.user.name;
  const imageUrl = session?.user.image;

  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        {/* <div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-white p-1 drop-shadow-sm">
            <Crown className="size-3 fill-yellow-500 text-yellow-500" />
          </div>
        </div> */}
        <Avatar className="size-10 transition hover:opacity-75">
          <AvatarImage alt={name} src={imageUrl || ''} />
          <AvatarFallback className="flex items-center justify-center bg-blue-500 font-medium text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          // disabled={mutation.isPending}
          onClick={onClick}
          className="h-10"
        >
          <CreditCard className="mr-2 size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-10" onClick={() => authClient.signOut()}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
