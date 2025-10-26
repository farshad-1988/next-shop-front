"use client";

import { Skeleton } from "@mui/material";
import Image from "next/image";
import { JSX, useState } from "react";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

import { Item } from "../types/types";
import { CenteredCard } from "./CenteredCard";

/**
 *
 * @param {Object} Item
 *
 * @returns {JSX.Element}
 */

const ImageComp = ({ item }: { item: Item }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(item.image);
  return (
    <CenteredCard>
      {loading && !error ? (
        <Skeleton variant="rectangular" width={300} height={300} />
      ) : error || !item.image || item.image === "" ? (
        <BrokenImageIcon color="disabled" sx={{ fontSize: "300px" }} />
      ) : (
        <Image
          src={item.image}
          alt={item.name}
          width={300}
          height={300}
          onLoadingComplete={() => {
            setLoading(false);
          }}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}
    </CenteredCard>
  );
};

export default ImageComp;
