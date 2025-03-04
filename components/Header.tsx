"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import { Button } from "./Shared/Button";
import { signOut } from "next-auth/react";
import NotificationIcon from "./Shared/NotificationIcon";
import { usePathname } from "next/navigation";
import { UserNotification, UserRole } from "@prisma/client";
import { UserDataType } from "@/types/types";
import logo from "../images/logos/codelogo.png";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/login">Sign in</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header({
  userData,
  notificationData,
}: {
  userData: UserDataType;
  notificationData: UserNotification[];
}) {
  const path = usePathname();

  if (
    (userData?.role !== UserRole.USER && path.includes("/admin")) ||
    path.includes("/question/")
  ) {
    return null;
  }
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link className="w-1/6" href="/" aria-label="Home">
              <img
                src="https://codecaffiene.com/wp-content/uploads/2023/02/codecaffiene-logo.png"
                alt="brand"
                className="w-full"
              />
            </Link>

            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="/quizzes">Quiz Tests</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              {userData && (
                <NavLink href={`/${userData.id}/profile`}>Profile</NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {!userData ? (
                <Button variant="outline" href="/signin">
                  Sign in
                </Button>
              ) : (
                <div className="flex items-end gap-5">
                  <NotificationIcon
                    userData={userData}
                    notificationData={notificationData}
                  />
                  <Button className="bg-red-700" onClick={() => signOut()}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
            {userData && (
              <Button
                href={`/${userData?.id}/reports/${undefined}`}
                color="blue"
              >
                <span>See your reports</span>
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
