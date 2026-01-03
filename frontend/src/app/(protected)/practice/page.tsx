"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionBank from "@/components/practice/QuestionBank";
import UserSolutions from "@/components/practice/UserSolutions";

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("question-bank");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Practice</h1>
        <p className="text-muted-foreground mt-2">
          Improve your problem-solving skills with our curated question bank and track your progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="question-bank">Question Bank</TabsTrigger>
          <TabsTrigger value="my-solutions">My Solutions</TabsTrigger>
        </TabsList>

        <TabsContent value="question-bank" className="space-y-6">
          <QuestionBank />
        </TabsContent>

        <TabsContent value="my-solutions" className="space-y-6">
          <UserSolutions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
