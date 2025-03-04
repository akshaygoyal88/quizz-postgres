"use client";

import { Fragment, createContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaBars } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { HiOutlineChartPie } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import pathName from "@/constants";
import { classNames } from "@/utils/classNames";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../Shared/Button";
import { FaRegFolderClosed } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { FaXmark } from "react-icons/fa6";
import { UserDataType } from "@/types/types";
import { MdQuiz } from "react-icons/md";
import { LuFileQuestion } from "react-icons/lu";

const navigation = [
  {
    name: "Dashboard",
    href: pathName.dashboard.path,
    icon: IoHomeOutline,
    current: "dashboard",
  },
  {
    name: "Reports",
    href: `${pathName.adminReportsRoute.path}/${undefined}`,
    icon: HiOutlineChartPie,
    current: "reports",
  },
  {
    name: "Quiz",
    href: pathName.quiz.path,
    icon: MdQuiz,
    current: "quiz",
    subItems: [
      {
        name: "All Quiz",
        href: pathName.quiz.path,
        icon: FaRegFolderClosed,
        current: "quiz",
      },
      {
        name: "Create Quiz",
        href: pathName.quizAdd.path,
        icon: GoPlus,
        current: "add-quiz",
      },
    ],
  },
  {
    name: "Question",
    href: `${pathName.questions.path}?page=1`,
    icon: LuFileQuestion,
    current: "questions",
    subItems: [
      {
        name: "All Questions",
        href: `${pathName.questions.path}?page=1`,
        icon: HiOutlineDocumentDuplicate,
        current: "questions",
      },
      {
        name: "Create Question",
        href: pathName.questionsAdd.path,
        icon: GoPlus,
        current: "add-question",
      },
    ],
  },
];

export const UserContext = createContext<UserDataType | null>(null);

export default function LeftSideBar({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: UserDataType;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname();
  const pathItems = path.split("/");

  return (
    <UserContext.Provider value={userData}>
      <>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 overflow-hidden z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex flex-1 max-w-xs w-full h-full bg-white">
                <button
                  type="button"
                  className="absolute top-0 right-0 -mr-12 mt-2 p-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FaXmark
                    className="h-6 w-6 text-gray-600"
                    aria-hidden="true"
                  />
                </button>

                {/* Sidebar content */}
                <div className="flex flex-col h-full overflow-y-auto p-6">
                  {/* Your sidebar navigation */}
                  <nav>
                    <ul>
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-indigo-600"
                                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100",
                              "group flex items-center gap-3 p-2 text-sm font-semibold rounded-md"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                          <ul className="pl-4">
                            {item.subItems &&
                              item.subItems.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    className={classNames(
                                      sub.current
                                        ? "bg-gray-100 text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100",
                                      "group flex items-center gap-3 p-2 text-sm font-semibold rounded-md"
                                    )}
                                  >
                                    <sub.icon
                                      className={classNames(
                                        sub.current
                                          ? "text-indigo-600"
                                          : "text-gray-400 group-hover:text-indigo-600",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            pathItems[pathItems.length - 1] === item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                        {item.subItems && (
                          <ul role="list" className="ml-4 space-y-1">
                            {item.subItems.map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={sub.href}
                                  className={classNames(
                                    pathItems[pathItems.length - 1] ===
                                      sub.current
                                      ? "bg-gray-50 text-indigo-600"
                                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <sub.icon
                                    className={classNames(
                                      sub.current
                                        ? "text-indigo-600"
                                        : "text-gray-400 group-hover:text-indigo-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <Link
                    title="Check your profile"
                    href={`/${userData.id}/profile`}
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src={userData?.profile_pic!}
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {userData?.first_name || userData?.email?.split("@")[0]}
                    </span>
                  </Link>
                  <Button
                    className="w-full my-2 rounded-none bg-red-700"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </a>
        </div>

        <main className="flex-1 flex-end overflow-y-auto lg:pl-40">
          <div className="">{children}</div>
        </main>
      </>
    </UserContext.Provider>
  );
}
