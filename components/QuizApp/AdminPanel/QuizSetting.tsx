"use client";

import { handleQuizSettingForm } from "@/action/actionQuizSettingForm";
import { Button } from "@/components/Shared/Button";
import Form, { FormInputs } from "@/components/Shared/Form";
import Heading from "@/components/Shared/Heading";
import Lable from "@/components/Shared/Lable";
import SimpleToggle from "@/components/Shared/SimpleToggle";
import { Quiz } from "@prisma/client";
import React, { useState } from "react";

export default function QuizSetting({
  quizId,
  quizSettingData,
}: {
  quizId: string;
  quizSettingData: Quiz;
}) {
  console.log(quizSettingData);
  const [restrictions, setRestrictions] = useState<{
    [key: string]: boolean;
  }>({
    select: quizSettingData?.select!,
    cut: quizSettingData?.cut!,
    copy: quizSettingData?.copy!,
    paste: quizSettingData?.paste!,
    newWindow: quizSettingData?.newWindow!,
    newTab: quizSettingData?.newTab!,
  });
  console.log(restrictions);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleToggleChange = (key: string) => {
    setRestrictions((prevRestrictions) => ({
      ...prevRestrictions,
      [key]: !prevRestrictions[key],
    }));
  };

  const listOfToggles = [
    {
      label: "Select",
      checked: restrictions.select,
      onChange: () => handleToggleChange("select"),
    },
    {
      label: "Cut",
      checked: restrictions.cut,
      onChange: () => handleToggleChange("cut"),
    },
    {
      label: "Copy",
      checked: restrictions.copy,
      onChange: () => handleToggleChange("copy"),
    },
    {
      label: "Paste",
      checked: restrictions.paste,
      onChange: () => handleToggleChange("paste"),
    },
    {
      label: "New Window",
      checked: restrictions.newWindow,
      onChange: () => handleToggleChange("newWindow"),
    },
    {
      label: "New Tab",
      checked: restrictions.newTab,
      onChange: () => handleToggleChange("newTab"),
    },
  ];

  const formAction = async (formData: FormData) => {
    for (const key in restrictions) {
      formData.append(key, restrictions[key]?.toString());
    }
    formData.append("id", quizId as string);
    const res: any = await handleQuizSettingForm(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Successfully saved.");
    }
  };

  return (
    <>
      <Heading headingText="Quiz Settings" tag={"h1"} />
      <Form action={formAction} error={error} success={success}>
        <FormInputs
          inputList={[
            {
              type: "number",
              id: "globalTimer",
              name: "globalTimer",
              label: "Global Timer",
              placeholder: "Time in seconds",
              defaultValue: `${quizSettingData.globalTimer}`,
              min: "0",
            },
            {
              type: "textarea",
              id: "subMsg",
              name: "quizSubmissionMessage",
              label: "Quiz Submission Message",
              defaultValue: `${quizSettingData.quizSubmissionMessage}`,
            },
          ]}
        />
        <div className="flex flex-col items-start my-5">
          <Heading headingText="Restrictions" tag={"h3"} />
          {listOfToggles.map((item) => (
            <Toggle
              label={item.label}
              checked={item.checked}
              onChange={item.onChange}
            />
          ))}
        </div>
        <Button>Save</Button>
      </Form>
    </>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex justify-between w-full p-3">
      <Lable labelText={label} classes="text-gray-700" />
      <span className="flex items-center gap-3">
        <SimpleToggle checked={checked} onChange={onChange} />
        {checked ? (
          <span className="text-red-500">Disabled</span>
        ) : (
          <span className="text-green-500">Enabled</span>
        )}
      </span>
    </div>
  );
}
