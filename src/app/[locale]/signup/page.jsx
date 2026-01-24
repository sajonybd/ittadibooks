import SignupForm from '@/app/components/SignupForm'
import React from 'react'

export default function page({searchParams}) {
  const callbackUrl = searchParams?.callbackUrl || "/dashboard";
  return <SignupForm callbackUrl={callbackUrl} />;
}
