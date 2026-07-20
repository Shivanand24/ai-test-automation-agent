"use client";

import Image from "next/image";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { UserDeatailContext } from "@/context/UserDeatailContext";
import EmptyWorkspace from "./EmptyWorkspace";

function WorkspaceBody() {
  const { userDetails } = useContext(UserDeatailContext);

  return (
    <div className="p-8">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-medium">
          Workspace
        </h2>

        <h2 className="text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">
          Remaining Credits: 1000
        </h2>
      </div>

      {/* GitHub Card */}
      <Card className="flex justify-between items-center p-4 rounded-lg">
        <div className="flex items-center gap-5">
          <Image
            src="/github.png"
            alt="github"
            width={40}
            height={40}
          />

          <h2 className="text-lg font-medium">
            Connect GitHub & Add Repository
          </h2>
        </div>

        <Button>Install</Button>
      </Card>


      <Card className="mt-8">
        <CardContent  >
          <EmptyWorkspace />
        </CardContent>
      </Card>
    </div>


  );
}

export default WorkspaceBody;