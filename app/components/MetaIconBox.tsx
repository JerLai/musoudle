'use client';
import React, { useState } from "react";
import InfoIcon from "./info/InfoIcon";
import ChangelogIcon from "./changelog/ChangeLogIcon";
import InfoModal from "./info/InfoModal";
import ChangelogModal from "./changelog/ChangeLogModal";

export default function MetaIconBox() {
  const [showInfo, setShowInfo] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  // Only show icons if no modal is open
  const showIcons = !showInfo && !showChangelog;

  return (
    <>
      {showIcons && (
        <>
          <InfoIcon onClick={() => setShowInfo(true)} />
          <ChangelogIcon onClick={() => setShowChangelog(true)} />
        </>
      )}
      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
      <ChangelogModal open={showChangelog} onClose={() => setShowChangelog(false)} />
    </>
  );
}