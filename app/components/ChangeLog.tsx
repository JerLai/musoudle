'use client';
import React, { useState } from "react";
import ChangelogIcon from "./changelog/ChangeLogIcon";
import ChangelogModal from "./changelog/ChangeLogModal";

export default function SomePage() {
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      <ChangelogIcon onClick={() => setShowChangelog(true)} />
      <ChangelogModal open={showChangelog} onClose={() => setShowChangelog(false)} />
      {/* ...rest of your page... */}
    </>
  );
}