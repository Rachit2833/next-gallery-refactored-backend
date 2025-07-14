export default function NotFoundCard({ text }) {
   return (
      <div className="relative border-4 border-dotted p-4 border-white rounded-xl w-[50rem] h-full max-w-full">
         {/* Outer Dots */}
         <div className="absolute w-2 h-2 bg-white rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
         <div className="absolute w-2 h-2 bg-white rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2" />
         <div className="absolute w-2 h-2 bg-white rounded-full bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
         <div className="absolute w-2 h-2 bg-white rounded-full bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

         {/* Content */}
         <div
            className="relative rounded-xl w-full h-full border-4 border-white p-6 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex justify-between items-end"
            style={{
               background:
                  "radial-gradient(circle at center, #fcb134 0%, #f58645 30%, #c6d8e9 90%)",
            }}
         >
            {/* Bottom Left Main Text */}
            <p className="text-white text-2xl font-semibold">{text.text}</p>

            {/* Bottom Right Small 404 */}
            <span className="text-white text-sm font-bold bg-black/30 px-3 py-1 rounded-md">
               
               {text.language}
            </span>
         </div>
      </div>
   );
}
 