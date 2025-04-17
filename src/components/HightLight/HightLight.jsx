import "./HightLight.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { rightImg, watchImg } from "../../utils";
import VideoCarousel from "../VideoCarousel/VideoCarousel";

export default function HightLight() {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 });
    gsap.to(".link", { opacity: 1, y: 0 ,direction:1 , stagger:0.25});
  }, []);

  return (
    <section
      id="highlight"
      className="w-screen overflow-hidden h-full common-padding bg-zinc-900"
    >
      <div className="screen-max-width">
        <div>
          <div className="mb-12 w-full flex items-end justify-between">
            <h1 id="title" className="section-heading">
              Get the highlight.
            </h1>

            <div className="flex flex-wrap items-end gap-5">
              <p className="link">
                Watch the film
                <img src={watchImg} alt="watch" className="!ml-2" />
              </p>
              <p className="link">
                Watch the event
                <img src={rightImg} alt="right" className="!ml-2" />
              </p>
            </div>
          </div>
          <VideoCarousel />
        </div>
      </div>
    </section>
  );
}
