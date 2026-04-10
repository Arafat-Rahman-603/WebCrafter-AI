"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
    <Navber />
    <motion.section className="pt-[20px]">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>About</h1>
          </div>
        </div>
      </div>
    </motion.section>
    </>
  );
}
