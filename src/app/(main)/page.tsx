"use client"


 


 
 
 
import CreateServicePage from "@/components/Pages/Home/CreateService";
import GetAllService from "@/components/Pages/Home/GetAllService";
import React from "react";


const Home = () => {
  return (
    <section className="w-full min-h-[900px]">
  
      <CreateServicePage></CreateServicePage>
      <GetAllService/>

    </section>
  );
};

export default Home;


