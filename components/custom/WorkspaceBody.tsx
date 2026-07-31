"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { UserDeatailContext } from "@/context/UserDeatailContext";
import EmptyWorkspace from "./EmptyWorkspace";
import axios from "axios";
import { useRouter } from "next/navigation";
import RepoDialog from "./RepoDialog";


function WorkspaceBody() {

  // const cookieStore = await cookies()

  // const token = cookieStore.get("gh_token")?.value


  const { userDetails } = useContext(UserDeatailContext);


  const router = useRouter()
  const [token, setToken] = useState('')
  useEffect(() => {
    getGithubToken();
  }, [])

  const getGithubToken = async () => {
    try {
      const res = await axios.get('/api/github/token');
      console.log(res.data.token)
      setToken(res.data.token)
    } catch (e) {
      console.error(e)
    }
  }

  const OnAddRepo = () => {
    window.location.href = '/api/github';
  }

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

        {!token ? <Button onClick={OnAddRepo} >Setup</Button>
          //repo dialog open when token is available


          : <RepoDialog setRefreshPage={(refresh: boolean) => console.log(refresh)} />}
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