"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

function WorkspaceHeader() {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(9,9,11,0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 1.5rem',
        }}>
            <div style={{
                maxWidth: 1200, margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 56,
            }}>
                {/* Logo + Brand */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <Image
                        src="/logo.svg"
                        alt="TestAgent"
                        width={28}
                        height={24}
                    />
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#fafafa', letterSpacing: '-0.01em' }}>
                        Test<span style={{ color: '#6366f1' }}>Agent</span>
                    </span>
                </Link>

                {/* Nav links */}
                <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}>
                    <li>
                        <Link href="/workspace" style={{ color: '#a1a1aa', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => (e.currentTarget.style.color = '#fafafa')}
                            onMouseOut={e => (e.currentTarget.style.color = '#a1a1aa')}>
                            Workspace
                        </Link>
                    </li>
                    <li>
                        <Link href="/#pricing" style={{ color: '#a1a1aa', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => (e.currentTarget.style.color = '#fafafa')}
                            onMouseOut={e => (e.currentTarget.style.color = '#a1a1aa')}>
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <a href="mailto:support@testagent.app" style={{ color: '#a1a1aa', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => (e.currentTarget.style.color = '#fafafa')}
                            onMouseOut={e => (e.currentTarget.style.color = '#a1a1aa')}>
                            Support
                        </a>
                    </li>
                </ul>

                {/* User Button */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: { width: 32, height: 32 },
                            },
                        }}
                    />
                </div>
            </div>
        </header>
    );
}

export default WorkspaceHeader;