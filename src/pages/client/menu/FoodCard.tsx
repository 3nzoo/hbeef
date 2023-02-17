import React, { useState } from 'react';
import { addToCart } from '../../../redux/cartSlice';
import { useClientAppDispatch } from '../../../redux/hooks';
import Food from './Food';

type Props = {
  data: any;
  showFood: (data: any) => void;
};

const FoodCard = ({ data, showFood }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useClientAppDispatch();

  const handleAddToCart = () => {
    const productId: string = data.id;
    const { name, price, img_Url } = data;
    if (productId)
      dispatch(addToCart({ name, productId, quantity, price, img_Url }));
  };

  const handleClick = () => {
    showFood(data);
    // onClick(props.data.)
  };

  return (
    <>
      <div
        className='xs:p-0 md:p-2 flex flex-col justify-between text-center cursor-pointer'
        onClick={handleClick}
      >
        <img
          className='w-auto h-36 object-cover rounded-t-lg rounded-lg shadow-lg text-center border-4 border-white'
          src={data.img_Url}
          loading='lazy'
          alt={data.name}
        />
        <div className='xs:py-3 md:p-4 px-0 text-center'>
          <h2 className='xs:text-sm md:text-base font-medium mb-2 text-blue-250'>
            {data.name}
            <span className='text-gray-600 text-sm mb-4 mx-2'>
              (₱{data.price}.00)
            </span>
          </h2>
          <div className='flex flex-wrap justify-center'>
            <input
              className='appearance-none grow bg-black-250 rounded-lg text-white p-2  shadow leading-tight focus:outline-none focus:shadow-outline text-lg placeholder-white mx-2 xs:max-h-[34px] md:max-h-[40px] max-w-[60px] focus:ring-blue-600 text-right xs:my-1'
              type='number'
              value={quantity}
              maxLength={2}
              minLength={1}
              placeholder='1'
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                if (Number(e.target.value) > 0)
                  setQuantity(Number(e.target.value));
              }}
            />
            <button
              className='xs:px-3 xs:py-2 xs:m-0 md:px-4 md:py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg xs:text-xs md:text-sm xs:my-1'
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodCard;
