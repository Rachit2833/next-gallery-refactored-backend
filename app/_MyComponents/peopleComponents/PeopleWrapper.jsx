'use client'
import React, { useEffect } from 'react';
import ImageCard from '../ImageCard';
import { useUser } from '@/app/_lib/context';
import NoImagesDoodle from '../NoImagesDoodle';
import { PagePagination } from '../Pagination';

const PeopleWrapper = ({res,name}) => {
  const {setFetchedImages}=useUser()
  useEffect(()=>{
    setFetchedImages(res.images)
  },[])
  return (
    <>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
       { res.images.length>0?
            res.images?.map((item, index) => (
               <ImageCard key={index} editSelection={true} name={name} image={item} />
            ))
         :<div className=' col-span-full'>
          <NoImagesDoodle /></div>}
          </div>
        <PagePagination totalPagesLeft={res.leftPage} />
    </>
  );
};

export default PeopleWrapper;