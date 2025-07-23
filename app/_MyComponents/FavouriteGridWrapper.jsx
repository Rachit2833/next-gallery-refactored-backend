'use client'
import React, { useEffect } from 'react';
import ImageCard from './ImageCard';
import { useUser } from '../_lib/context';
import NoImagesDoodle from './NoImagesDoodle';
import { PagePagination } from './Pagination';

const FavouriteGridWrapper = ({ res }) => {
  const { setFetchedImages } = useUser()
  useEffect(() => {
    setFetchedImages(res.images)
  }, [])
  return (
    <>
     <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
      {res.images.length > 0 ?
        res.images?.map((item, index) => (
          <ImageCard res={res.images} key={index} editSelection={true} image={item} />
        ))
        : <div className='col-span-full'>
          <NoImagesDoodle />
        </div>}
      </div>

        <PagePagination totalPagesLeft={res.leftPage} />

    </>
  );
};

export default FavouriteGridWrapper;