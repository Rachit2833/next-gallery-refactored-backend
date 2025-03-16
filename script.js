
const flow = document.querySelectorAll("#page2");
const flowText = document.querySelectorAll("#page2 h1");
const stringX = document.querySelector("#string");
const orignalPath = `M 20 100 Q 250 100 1280 100`;
console.log(flow,flowText);
gsap.to(flowText,{
      transform:"translateX(-78%)",
      scrollTrigger:{
        trigger:flow,
        scroller:"body",
        markers:true,
        start:"top 0%",
        end:"top -250%",
        pin:true,
        scrub:2
      },
      duration:5
})
const tl = gsap.timeline()
tl.from("#xdiv h1,#x", {
  y: -40,
  opacity:0,
  delay:1
});
tl.from("#nav2 h2", {
  y: -40,
  opacity: 0,
  stagger: 0.3,
});
stringX.addEventListener('mousemove',(dift)=>{
   path = `M 20 100 Q 250 ${dift.y} 1280 100`;
   gsap.to("svg path",{
       attr:{d:path}
   })
})
stringX.addEventListener("mouseleave", (dift) => {
  gsap.to("svg path", {
    attr: {
      d: orignalPath,
      duration: 2.5,
      ease: "elastic.out(1,0.1)",
      y: -250,
    },
  });
});
