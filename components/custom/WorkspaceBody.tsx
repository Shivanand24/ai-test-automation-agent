"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { UserDeatailContext } from "@/context/UserDeatailContext";
import EmptyWorkspace from "./EmptyWorkspace";
import UserRepoList from "./UserRepoList";
import axios from "axios";
import { useRouter } from "next/navigation";
import RepoDialog from "./RepoDialog";

export type UserRepo = {
  id: number;
  repoId: number;
  userId: number;
  name: string;
  fullName: string;
  private: number;
  htmlUrl: string;
  description: string;
  language: string;
  updatedAt: string;
  owner: string;
  defaultBranch: string;
  targetDomain?: string;
  globalInstruction?: string;
}

function WorkspaceBody() {

  // const cookieStore = await cookies()

  // const token = cookieStore.get("gh_token")?.value


  const { userDetails } = useContext(UserDeatailContext);


  const router = useRouter()
  const [token, setToken] = useState('')
  const [userRepoList, setUserRepoList] = useState<UserRepo[]>([])
  useEffect(() => {
    getGithubToken();

  }, [])

  useEffect(() => {
    if (userDetails?.id) {
      GetUserAddedRepoList();
    }
  }, [userDetails])

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


  const GetUserAddedRepoList = async () => {
    try {
      const result = await axios.get('/api/user-repo?userId=' + userDetails?.id);
      console.log(result.data);
      setUserRepoList(result.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa', padding: '32px 32px' }}>
      {/* Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#fafafa' }}>
          Workspace
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 13, fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
          1000 Credits Remaining
        </div>
      </div>

      {/* GitHub Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: 14, background: '#111113', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/github.png"
              alt="github"
              width={26}
              height={26}
            />
          </div>

          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#fafafa' }}>
              Connect GitHub &amp; Add Repository
            </h2>
            <p style={{ fontSize: 12, color: '#71717a', margin: '2px 0 0' }}>Link your repo to start generating AI-powered test cases</p>
          </div>
        </div>

        {!token ? (
          <button onClick={OnAddRepo}
            style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', transition: 'all 0.2s' }}>
            Setup
          </button>
        ) : (
          <RepoDialog setRefreshPage={(refresh: boolean) => GetUserAddedRepoList()} />
        )}
      </div>

      {!userRepoList || userRepoList.length === 0 ? (
        <div style={{ marginTop: 24, borderRadius: 14, background: '#111113', border: '1px solid rgba(255,255,255,0.07)', padding: 32 }}>
          <EmptyWorkspace />
        </div>
      ) : (
        <UserRepoList repoList={userRepoList} setReload={() => GetUserAddedRepoList()} />
      )}
    </div>


  )
}

export default WorkspaceBody;