"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const fade = { hidden:{opacity:0,y:25}, visible:{opacity:1,y:0,transition:{duration:0.7}} };
const stag = { hidden:{}, visible:{transition:{staggerChildren:0.15}} };

export default function HomePageClient({ initialCmsData }: { initialCmsData: Record<string, string> }) {
  const [cmsData, setCmsData] = useState(initialCmsData);
  const [slide,setSlide]=useState(0);
  const [faq,setFaq]=useState<number|null>(0);

  useEffect(()=>{
    const timer=setInterval(()=>setSlide(p=>(p+1)%5),4500);
    return()=>clearInterval(timer);
  },[]);

  // Listen for Live Preview updates from Admin Panel
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "CMS_UPDATE") {
        setCmsData(prev => ({ ...prev, [e.data.key]: e.data.value }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const t = (key: string, fallback: string) => cmsData[key] || fallback;

  const slides = [
    { 
      img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",   
      caption: t("hero_slide1_caption", "Your Gateway to Top Global Universities"), 
      sub: t("hero_slide1_sub", "Don't leave your future to chance. Get admitted to elite institutions in the UK, USA, Canada, Dubai, and Europe with our proven admission strategies.") 
    },
    { 
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",  
      caption: t("hero_slide2_caption", "Stop Guessing, Start Building."), 
      sub: t("hero_slide2_sub", "Transform confusion into absolute clarity. We help you map out a high-demand career path tailored to your unique strengths and aspirations.") 
    },
    { 
      img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",     
      caption: t("hero_slide3_caption", "Stand Out in a Sea of Applicants"), 
      sub: t("hero_slide3_sub", "Grades aren't enough. We craft compelling Statements of Purpose and build Ivy-league-worthy portfolios that make admissions officers take notice.") 
    },
    { 
      img: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1600&auto=format&fit=crop",      
      caption: t("hero_slide4_caption", "Nail Your Target IELTS Score & Visa"), 
      sub: t("hero_slide4_sub", "Achieve Band 8+ with our expert coaching. Once you're admitted, we handle the complex visa and financial paperwork so you don't have to.") 
    },
    { 
      img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1600&auto=format&fit=crop",         
      caption: t("hero_slide5_caption", "We Walk With You — Every Step"), 
      sub: t("hero_slide5_sub", "From the first profile evaluation to your first day on campus. We provide end-to-end support so you never walk alone.") 
    }
  ];

  const services = [
    {
      title: t("service1_title", "Before the Offer Letter"),
      subtitle: t("service1_subtitle", "Building the Right Foundation"),
      icon: "fa-seedling",
      image: "/images/service_card_before_offer.png",
      points: [
        t("service1_point1", "Career & Profile Assessment"),
        t("service1_point2", "Course & University Selection"),
        t("service1_point3", "SOP & LOR Guidance"),
        t("service1_point4", "IELTS / TOEFL Preparation")
      ]
    },
    {
      title: t("service2_title", "After the Offer Letter"),
      subtitle: t("service2_subtitle", "Preparing for the Move"),
      icon: "fa-file-contract",
      image: "/images/service_card_after_offer.png",
      points: [
        t("service2_point1", "Final University Selection"),
        t("service2_point2", "Comprehensive Visa Support"),
        t("service2_point3", "Financial Documentation"),
        t("service2_point4", "Pre-Departure Guidance")
      ]
    },
    {
      title: t("service3_title", "After Departure"),
      subtitle: t("service3_subtitle", "Settling into Your New Life"),
      icon: "fa-globe-americas",
      image: "/images/service_card_after_departure.png",
      points: [
        t("service3_point1", "Arrival & Settling-In Support"),
        t("service3_point2", "Local Transport Navigation"),
        t("service3_point3", "SIM & Banking Setup"),
        t("service3_point4", "Campus Orientation")
      ]
    }
  ];

  const faqs=[
    {q:t("faq1_q", "When is the right time to start planning for study abroad?"),a:t("faq1_a", "We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing.")},
    {q:t("faq2_q", "Do you guarantee university admissions?"),a:t("faq2_a", "While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations.")},
    {q:t("faq3_q", "Do you assist with selecting the right major or course?"),a:t("faq3_a", "Yes. We use detailed psychometric evaluations and industry insights to help you choose a course that aligns with both your passions and future market demand.")},
    {q:t("faq4_q", "How do I start the process?"),a:t("faq4_a", "You can start by booking a free initial consultation through our contact page. We will assess your profile and discuss a personalized roadmap.")},
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))})}} />

      {/* HERO CAROUSEL */}
      <section className="hero" style={{position:"relative",display:"flex",alignItems:"center",overflow:"hidden",justifyContent:"center"}}>
        {slides.map((s,i)=>(
          <div key={i} style={{position:"absolute",inset:0,transition:"opacity 1.2s ease",opacity:slide===i?1:0,backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center top"}} />
        ))}
        {/* Cleaner, more premium gradient overlay */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(37,95,107,0.85) 0%, rgba(37,95,107,0.4) 50%, rgba(10,20,25,0.7) 100%)"}} />
        
        <div className="container" style={{position:"relative",zIndex:2,textAlign:"center"}}>
          <motion.div initial="hidden" animate="visible" variants={fade} style={{maxWidth:800,margin:"0 auto"}}>
            <span style={{display:"inline-block",background:"rgba(255,255,255,0.15)",color:"#fff",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"0.85rem",letterSpacing:"3px",textTransform:"uppercase",padding:"8px 20px",borderRadius:30,marginBottom:24,border:"1px solid rgba(255,255,255,0.3)",backdropFilter:"blur(5px)"}}>
              {t("hero_badge_label", "We Turn Confusion into Career Fusion")}
            </span>
            <h1 style={{color:"#fff",fontSize:"clamp(2.5rem,6vw,4.5rem)",lineHeight:1.15,marginBottom:20,fontFamily:"var(--font-heading)",fontWeight:800,textShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
              {slides[slide].caption}
            </h1>
            <p style={{color:"rgba(255,255,255,0.9)",fontSize:"1.2rem",marginBottom:40,lineHeight:1.6,maxWidth:600,margin:"0 auto 40px"}}>
              {slides[slide].sub}
            </p>
            <div className="hero-buttons" style={{display:"flex",gap:16,justifyContent:"center"}}>
              <Link href="/contact" className="btn btn-primary" style={{padding:"14px 32px",fontSize:"1.05rem",borderRadius:"30px"}}>{t("hero_cta_primary", "Book a Free Consultation")}</Link>
              <Link href="/services" className="btn btn-outline" style={{color:"#fff",borderColor:"rgba(255,255,255,0.6)",padding:"14px 32px",fontSize:"1.05rem",borderRadius:"30px",backdropFilter:"blur(5px)"}}>{t("hero_cta_secondary", "Explore Services")}</Link>
            </div>
          </motion.div>
          
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:60}}>
            <button onClick={()=>setSlide(p=>(p-1+slides.length)%slides.length)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"50%",width:44,height:44,cursor:"pointer",color:"#fff",fontSize:"1.2rem",backdropFilter:"blur(5px)",transition:"all 0.3s"}} className="hero-nav-btn">‹</button>
            <div style={{display:"flex",gap:10}}>
              {slides.map((_,i)=>(
                <button key={i} onClick={()=>setSlide(i)} style={{width:slide===i?36:10,height:10,borderRadius:5,background:slide===i?"#F0C987":"rgba(255,255,255,0.4)",border:"none",cursor:"pointer",transition:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"}} />
              ))}
            </div>
            <button onClick={()=>setSlide(p=>(p+1)%slides.length)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"50%",width:44,height:44,cursor:"pointer",color:"#fff",fontSize:"1.2rem",backdropFilter:"blur(5px)",transition:"all 0.3s"}} className="hero-nav-btn">›</button>
          </div>
        </div>
      </section>

      {/* 3 SERVICES */}
      <section className="bg-sage-section" style={{padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span className="text-accent font-sans">{t("services_section_title", "Our Services")}</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:600}} dangerouslySetInnerHTML={{ __html: t("services_section_subtitle", "How We Support <span class=\"text-highlight\">Your Journey</span>") }} />
            <p style={{color:"var(--text-secondary)",fontSize:"1.05rem",marginTop:8}}>End-to-end support across every stage of your study abroad journey.</p>
          </motion.div>
          <motion.div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28,marginTop:40}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {services.map((s,i)=>(
              <Link key={i} href={i === 0 ? "/services#before-offer" : i === 1 ? "/services#after-offer" : "/services#after-departure"} style={{textDecoration:"none",color:"inherit",display:"block"}}>
                <motion.div variants={fade} className="service-card-interactive" style={{background:"white",borderRadius:18,overflow:"hidden",boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)",position:"relative",height:"100%"}}>
                  <div className="svc-card-img" style={{height:220,position:"relative",overflow:"hidden"}}>
                    <Image src={s.image} alt={s.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit:"cover",transition:"transform 0.6s ease"}} className="svc-img" />
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"}} />
                    <div style={{position:"absolute",bottom:16,left:24,width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.2rem",border:"1px solid rgba(255,255,255,0.3)"}}>
                      <i className={`fas ${s.icon}`}/>
                    </div>
                  </div>
                  <div style={{padding:"28px 24px",position:"relative",zIndex:2,background:"white"}} className="svc-content">
                    <span style={{fontSize:"0.75rem",fontWeight:800,color:"var(--color-muted-coral)",textTransform:"uppercase",letterSpacing:"1.5px",fontFamily:"var(--font-heading)"}}>{s.subtitle}</span>
                    <h3 style={{fontSize:"1.4rem",color:"var(--color-deep-teal)",margin:"8px 0 16px",fontFamily:"var(--font-heading)",fontWeight:800}}>{s.title}</h3>
                    
                    <div className="svc-details-visible" style={{marginTop:"15px"}}>
                      <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:10}}>
                        {s.points.map((p,j)=>(
                          <li key={j} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:"0.9rem",color:"var(--text-secondary)"}}>
                            <i className="fas fa-check-circle" style={{color:"var(--color-soft-teal)",fontSize:"1rem",flexShrink:0,marginTop:2}}/>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
          <div style={{textAlign:"center",marginTop:40}}>
            <Link href="/services" className="btn btn-outline">View Full Service Details</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:"var(--bg-secondary)",padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span className="text-accent">{t("steps_section_title", "How It Works")}</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>The 4-Step Journey</h2>
          </motion.div>
          <motion.div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24,marginTop:40}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {step:"01",title:t("step1_title", "Discovery Profile"),desc:t("step1_desc", "We evaluate your academic background, interests and aspirations."),icon:"fa-user-graduate"},
              {step:"02",title:t("step2_title", "Strategic Roadmap"),desc:t("step2_desc", "We shortlist universities and map required tests like IELTS/TOEFL."),icon:"fa-map-marked-alt"},
              {step:"03",title:t("step3_title", "Application & SOP"),desc:t("step3_desc", "We meticulously build your portfolio and craft compelling essays."),icon:"fa-pen-fancy"},
              {step:"04",title:t("step4_title", "Visa & Pre-Departure"),desc:t("step4_desc", "We secure your visa and prepare you for life in a new country."),icon:"fa-passport"},
            ].map((p,i)=>(
              <motion.div key={i} variants={fade} style={{background:"var(--bg-primary)",padding:30,borderRadius:16,position:"relative",boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)"}}>
                <div style={{position:"absolute",top:-14,left:22,background:"var(--color-deep-teal)",color:"white",padding:"4px 14px",borderRadius:20,fontWeight:800,fontSize:"0.8rem",fontFamily:"var(--font-heading)"}}>Step {p.step}</div>
                <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(62,159,168,0.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-deep-teal)",fontSize:"1.2rem",marginTop:12,marginBottom:14}}>
                  <i className={`fas ${p.icon}`}/>
                </div>
                <h3 style={{marginTop:0,fontSize:"1.1rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800}}>{p.title}</h3>
                <p style={{color:"var(--text-secondary)",margin:0,lineHeight:1.7,fontSize:"0.92rem"}}>{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sage-section" style={{padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span className="text-accent">{t("testimonials_section_label", "Success Stories")}</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>{t("testimonials_section_title", "What Parents & Students Say")}</h2>
          </motion.div>
          <motion.div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28,marginTop:32}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {name:"Aarav Sharma",role:"Admitted to NYU",text:"Ria completely transformed my application. Her insights on my SOP made all the difference."},
              {name:"Mrs. Kapoor",role:"Parent",text:"We were overwhelmed with the UK visa process. Ria handled everything smoothly and professionally."},
              {name:"Simran Kaur",role:"IELTS Band 8",text:"The structured mock interviews and writing evaluations helped me score far above my target."},
            ].map((t_item,i)=>(
              <motion.div key={i} variants={fade} style={{background:"white",padding:30,borderRadius:16,borderLeft:"4px solid var(--color-soft-teal)",boxShadow:"var(--shadow-soft)"}}>
                <i className="fas fa-quote-left" style={{fontSize:"1.8rem",color:"rgba(62,159,168,0.18)"}}/>
                <p style={{marginTop:12,fontStyle:"italic",color:"var(--text-secondary)",lineHeight:1.75,fontSize:"0.95rem"}}>"{t_item.text}"</p>
                <h4 style={{marginTop:18,color:"var(--color-deep-teal)",marginBottom:4,fontFamily:"var(--font-heading)",fontWeight:800}}>{t_item.name}</h4>
                <span style={{fontSize:"0.8rem",color:"var(--text-secondary)"}}>{t_item.role}</span>
              </motion.div>
            ))}
          </motion.div>
          <div style={{textAlign:"center",marginTop:36}}>
            <Link href="/testimonials" className="btn btn-outline">{t("testimonials_cta", "Read All Success Stories")}</Link>
          </div>
        </div>
      </section>

      {/* WORKSHOP */}
      <section style={{background:"var(--bg-secondary)",padding:"80px 0"}}>
        <div className="container">
          <div className="flex-section" style={{display:"flex",flexWrap:"wrap",gap:50,alignItems:"center"}}>
            <motion.div style={{flex:"1 1 300px"}} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <Image src="/images/whatsapp_image_2024-03-20_at_10.27.00_2_1.jpeg" alt="Workshop event" width={600} height={400} style={{width:"100%",height:"auto",borderRadius:18,boxShadow:"0 20px 40px rgba(0,0,0,0.1)"}}/>
            </motion.div>
            <motion.div style={{flex:"1 1 300px"}} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <span className="text-accent">{t("workshop_section_label", "Live Events")}</span>
              <h2 style={{fontSize:"clamp(1.8rem,3vw,2.3rem)",color:"var(--color-deep-teal)",marginBottom:18,fontFamily:"var(--font-heading)",fontWeight:800}}>{t("workshop_section_heading", "Upcoming Masterclasses")}</h2>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:26,lineHeight:1.8}}>{t("workshop_section_desc", "Join our free online masterclasses where we break down the Ivy League admission process, IELTS strategies, and profile-building secrets.")}</p>
              <div style={{background:"var(--bg-primary)",padding:20,borderRadius:12,marginBottom:22,borderLeft:"4px solid var(--color-soft-teal)"}}>
                <h4 style={{color:"var(--color-deep-teal)",marginBottom:6,fontFamily:"var(--font-heading)",fontWeight:800}}>{t("workshop_title", "Mastering the Common App")}</h4>
                <p style={{fontSize:"0.9rem",color:"#666",margin:0}}><i className="far fa-calendar-alt"/> {t("workshop_date", "August 15th, 2026 | 6:00 PM IST")}</p>
              </div>
              <Link href="/contact" className="btn btn-primary">{t("workshop_cta", "Register for Free")}</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{background:"var(--color-deep-teal)",color:"white",padding:"60px 0"}}>
        <div className="container">
          <motion.div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:30,textAlign:"center"}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {v:t("stat_students", "500+"),l:t("stat_students_label", "Students Placed")},
              {v:t("stat_universities", "1500+"),l:t("stat_universities_label", "Top Universities")},
              {v:t("stat_career_paths", "160+"),l:t("stat_career_paths_label", "Career Paths")},
              {v:t("stat_success_rate", "98%"),l:t("stat_success_rate_label", "Success Rate")}
            ].map((s,i)=>(
              <motion.div key={i} variants={fade}>
                <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",color:"#F0C987",margin:"0 0 6px",fontFamily:"var(--font-heading)",fontWeight:800}}>{s.v}</h2>
                <p style={{fontSize:"1rem",opacity:0.9,margin:0}}>{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT FOUNDER */}
      <section style={{background:"var(--bg-primary)",padding:"80px 0"}}>
        <div className="container">
          <div className="flex-section" style={{display:"flex",flexWrap:"wrap",gap:50,alignItems:"center"}}>
            <motion.div style={{flex:"1 1 300px",position:"relative"}} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <Image src="/images/ria_portrait.jpg" alt="Ria Jain – Founder & Lead Counsellor" width={500} height={600} style={{width:"100%",height:"auto",borderRadius:20,boxShadow:"0 25px 50px rgba(0,0,0,0.15)"}} />
              <div className="founder-badge" style={{position:"absolute",bottom:-20,right:-20,background:"var(--color-deep-teal)",color:"white",padding:"16px 24px",borderRadius:16,boxShadow:"0 15px 30px rgba(0,0,0,0.15)",border:"1px solid var(--color-accent-gold)"}}>
                <span className="font-cursive" style={{fontSize:"1.8rem",color:"var(--color-accent-gold)",display:"block",lineHeight:1}}>{t("founder_name", "Ria Jain")}</span>
                <p style={{margin:"4px 0 0",fontSize:"0.72rem",fontFamily:"var(--font-sans)",textTransform:"uppercase",letterSpacing:"1.5px",opacity:0.9}}>{t("founder_title", "Lead Counsellor & Founder")}</p>
              </div>
            </motion.div>
            <motion.div style={{flex:"1 1 300px"}} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <span className="text-accent font-sans">About Us</span>
              <h2 style={{fontSize:"clamp(2.2rem,4vw,3.2rem)",color:"var(--color-deep-teal)",marginBottom:18,fontFamily:"var(--font-heading)",fontWeight:600}} dangerouslySetInnerHTML={{ __html: t("about_heading", "Guiding You <span class=\"text-highlight\">Beyond Borders</span>") }} />
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:16,lineHeight:1.8}}>{t("about_para1", "Sometimes, all we need is the right guidance at the right time. That's why My Skill Counsellor was founded in 2023—to be a trusted guide, helping individuals navigate important academic and career decisions with clarity and confidence.")}</p>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:28,lineHeight:1.8}}>{t("about_para2", "As both a counsellor and a parent of an international student myself, I bring professional expertise and real-world understanding. Every student has a different story, pace, and aspiration.")}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
                {[
                  t("founder_badge1", "MA English Degree"),
                  t("founder_badge2", "EduMilestones Certified"),
                  t("founder_badge3", "CCCIS Certified"),
                  t("founder_badge4", "USA / UK / Canada Visa Certified")
                ].map((b,i)=>(
                  <span key={i} style={{padding:"6px 14px",borderRadius:20,background:"rgba(62,159,168,0.1)",color:"var(--color-deep-teal)",fontSize:"0.82rem",fontWeight:700,fontFamily:"var(--font-heading)",display:"inline-flex",alignItems:"center",gap:6}}>
                    <i className="fas fa-certificate" style={{color:"var(--color-soft-teal)",fontSize:"0.75rem"}}/>
                    {b}
                  </span>
                ))}
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <Link href="/contact" className="btn btn-outline" style={{display:"inline-flex",alignItems:"center",gap:10}}>{t("about_cta", "Book a Chat")} <i className="fas fa-arrow-right"/></Link>
                <Link href="https://www.linkedin.com/in/riajain26" target="_blank" style={{color:"var(--color-deep-teal)",fontWeight:700,fontSize:"0.9rem",display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}>
                  <i className="fab fa-linkedin" style={{fontSize:"1.2rem",color:"#0077b5"}}/> Verify on LinkedIn
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"80px 0",background:"var(--bg-secondary)"}}>
        <div className="container" style={{maxWidth:780,margin:"0 auto"}}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span className="text-accent">{t("faq_section_label", "Clarifications")}</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>{t("faq_section_title", "Frequently Asked Questions")}</h2>
          </motion.div>
          <div style={{marginTop:36}}>
            {faqs.map((f,i)=>(
              <div key={i} style={{marginBottom:12,background:"var(--bg-primary)",borderRadius:14,overflow:"hidden",boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)"}}>
                <button onClick={()=>setFaq(faq===i?null:i)} style={{width:"100%",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontWeight:700,fontSize:"1rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)"}}>
                  {f.q}
                  <i className={`fas fa-chevron-${faq===i?"up":"down"}`} style={{color:"var(--color-soft-teal)",flexShrink:0,marginLeft:12}}/>
                </button>
                {faq===i&&<div style={{padding:"0 22px 18px",color:"var(--text-secondary)",lineHeight:1.75,fontSize:"0.95rem"}}><p style={{margin:0}}>{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
