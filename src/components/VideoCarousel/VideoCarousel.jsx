import gsap from "gsap"; // استيراد مكتبة GSAP للأنيميشن
import { useGSAP } from "@gsap/react"; // استيراد هوك خاص بـ GSAP مع React
import { ScrollTrigger } from "gsap/all"; // استيراد ScrollTrigger لإطلاق الأنيميشن عند التمرير

gsap.registerPlugin(ScrollTrigger); // تسجيل ScrollTrigger كمكوّن ضمن GSAP

import { useEffect, useRef, useState } from "react"; // استيراد هوكات React

import { hightlightsSlides } from "../../constants"; // استيراد بيانات الفيديوهات
import { pauseImg, playImg, replayImg } from "../../utils"; // استيراد صور أيقونات التحكم

// مكون VideoCarousel
const VideoCarousel = () => {
  // إنشاء مراجع لعناصر الفيديو و مؤشرات التقدم و الحاويات
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // حالة تخزين بيانات الفيديو الحالي وحالته
  const [video, setVideo] = useState({
    isEnd: false, // هل الفيديو الحالي انتهى
    startPlay: false, // هل بدأ التشغيل
    videoId: 0, // رقم الفيديو الحالي
    isLastVideo: false, // هل هو آخر فيديو
    isPlaying: false, // هل الفيديو قيد التشغيل
  });

  // حالة تخزين بيانات تحميل الميتاداتا
  const [loadedData, setLoadedData] = useState([]);

  // فك بيانات الحالة لتسهيل الوصول
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // GSAP هوك لتشغيل أنيميشن عند تغيير الفيديو أو انتهائه
  useGSAP(() => {
    // تحريك السلايدر أفقياً عند الانتقال لفيديو جديد
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // تشغيل الفيديو عند الوصول إليه بالتمرير
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  // تحديث تقدم المؤشر الخاص بالفيديو
  useEffect(() => {
    let currentProgress = 0; // قيمة التقدم الحالية
    let span = videoSpanRef.current; // المؤشر

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;

            // تحريك عرض الحاوية
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            // تحديث عرض ولون المؤشر
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        // عند اكتمال الفيديو تغيّر المؤشر
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { width: "12px" });
            gsap.to(span[videoId], { backgroundColor: "#afafaf" });
          }
        },
      });

      if (videoId == 0) anim.restart(); // بداية أول فيديو

      // تحديث قيمة progress حسب الزمن الحالي
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate); // تشغيل المحدث
      } else {
        gsap.ticker.remove(animUpdate); // إيقاف المحدث
      }
    }
  }, [videoId, startPlay]);

  // التحكم في التشغيل والإيقاف حسب حالة الفيديو
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // دوال التحكم بحالة الفيديو
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      default:
        return video;
    }
  };

  // دالة تحميل بيانات الفيديو
  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  // الواجهة الرئيسية للـ Carousel
  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;