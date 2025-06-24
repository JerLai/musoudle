'use client';
import React, { useState } from 'react'
import InfoIcon from "./info/InfoIcon";
import InfoModal from "./info/InfoModal";

const InfoGlobal = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InfoIcon onClick={() => setOpen(true)} />
      <InfoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default InfoGlobal