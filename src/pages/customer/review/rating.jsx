const StarRating = ({ rating = 3, reviewsCount = 0 }) => {
  const starSVG = (
    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
      <path d="M10 15l-5.878 3.09L5.82 11.545 1 7.91l6.09-.545L10 2l2.91 5.364 6.09.545-4.82 3.636 1.697 6.545z" />
    </svg>
  );

  return (
    <div className="flex   gap-2 flex justify-between items-center">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.min(Math.max(rating - i + 1, 0), 1) * 100 ;

          return (
            <div key={i} className="relative w-5 h-5 ">
              {/* background star */}
              <div className="absolute inset-0 text-gray-300">
                {starSVG}
              </div>

              {/* filled part */}
              <div
                className="absolute inset-0 text-yellow-400 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                {starSVG}
              </div>
            </div>
          );
        })}
      </div>

      {/* reviews text */}
      <span className="text-sm text-gray-500">
        {rating.toFixed(1)} ({reviewsCount})
      </span>
    </div>
  );
};

export default StarRating;