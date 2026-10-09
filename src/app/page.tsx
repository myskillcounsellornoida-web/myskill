"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const fade = { hidden:{opacity:0,y:25}, visible:{opacity:1,y:0,transition:{duration:0.7}} };
const stag = { hidden:{}, visible:{transition:{staggerChildren:0.15}} };

const slides = [
  { 
    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",   
    caption: "Your Gateway to Top Global Universities", 
    sub: "Don't leave your future to chance. Get admitted to elite institutions in the UK, USA, Canada, Dubai, and Europe with our proven admission strategies." 
  },
  { 
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",  
    caption: "Stop Guessing, Start Building.", 
    sub: "Transform confusion into absolute clarity. We help you map out a high-demand career path tailored to your unique strengths and aspirations." 
  },
  { 
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",     
    caption: "Stand Out in a Sea of Applicants", 
    sub: "Grades aren't enough. We craft compelling Statements of Purpose and build Ivy-league-worthy portfolios that make admissions officers take notice." 
  },
  { 
    img: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1600&auto=format&fit=crop",      
    caption: "Nail Your Target IELTS Score & Visa", 
    sub: "Achieve Band 8+ with our expert coaching. Once you're admitted, we handle the complex visa and financial paperwork so you don't have to." 
  },
  { 
    img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1600&auto=format&fit=crop",         
    caption: "We Walk With You — Every Step", 
    sub: "From the first profile evaluation to your first day on campus. We provide end-to-end support so you never walk alone." 
  }
];

const services = [
  {
    title: "Before the Offer Letter",
    subtitle: "Building the Right Foundation",
    icon: "fa-seedling",
    image: "/images/service_card_before_offer.png",
    points: [
      "Career & Profile Assessment",
      "Course & University Selection",
      "SOP & LOR Guidance",
      "IELTS / TOEFL Preparation"
    ]
  },
  {
    title: "After the Offer Letter",
    subtitle: "Preparing for the Move",
    icon: "fa-file-contract",
    image: "/images/service_card_after_offer.png",
    points: [
      "Final University Selection",
      "Comprehensive Visa Support",
      "Financial Documentation",
      "Pre-Departure Guidance"
    ]
  },
  {
    title: "After Departure",
    subtitle: "Settling into Your New Life",
    icon: "fa-globe-americas",
    image: "/images/service_card_after_departure.png",
    points: [
      "Arrival & Settling-In Support",
      "Local Transport Navigation",
      "SIM & Banking Setup",
      "Campus Orientation"
    ]
  }
];

export default function Home() {
  const [slide,setSlide]=useState(0);
  const [faq,setFaq]=useState<number|null>(0);
  useEffect(()=>{const t=setInterval(()=>setSlide(p=>(p+1)%slides.length),4500);return()=>clearInterval(t);},[]);

  const faqs=[
    {q:"When is the right time to start planning for study abroad?",a:"We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing."},
    {q:"Do you guarantee university admissions?",a:"While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations."},
    {q:"Do you assist with selecting the right major or course?",a:"Yes. We use detailed psychometric evaluations and industry insights to help you choose a course that aligns with both your passions and future market demand."},
    {q:"How do I start the process?",a:"You can start by booking a free initial consultation through our contact page. We will assess your profile and discuss a personalized roadmap."},
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
              We Turn Confusion into Career Fusion
            </span>
            <h1 style={{color:"#fff",fontSize:"clamp(2.5rem,6vw,4.5rem)",lineHeight:1.15,marginBottom:20,fontFamily:"var(--font-heading)",fontWeight:800,textShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
              {slides[slide].caption}
            </h1>
            <p style={{color:"rgba(255,255,255,0.9)",fontSize:"1.2rem",marginBottom:40,lineHeight:1.6,maxWidth:600,margin:"0 auto 40px"}}>
              {slides[slide].sub}
            </p>
            <div className="hero-buttons" style={{display:"flex",gap:16,justifyContent:"center"}}>
              <Link href="/contact" className="btn btn-primary" style={{padding:"14px 32px",fontSize:"1.05rem",borderRadius:"30px"}}>Book a Free Consultation</Link>
              <Link href="/services" className="btn btn-outline" style={{color:"#fff",borderColor:"rgba(255,255,255,0.6)",padding:"14px 32px",fontSize:"1.05rem",borderRadius:"30px",backdropFilter:"blur(5px)"}}>Explore Services</Link>
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
            <span className="text-accent font-sans">Our Services</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:600}}>
              How We Support <span className="text-highlight">Your Journey</span>
            </h2>
            <p style={{color:"var(--text-secondary)",fontSize:"1.05rem",marginTop:8}}>End-to-end support across every stage of your study abroad journey.</p>
          </motion.div>
          <motion.div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28,marginTop:40}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {services.map((s,i)=>(
              <Link key={i} href={i === 0 ? "/services#before-offer" : i === 1 ? "/services#after-offer" : "/services#after-departure"} style={{textDecoration:"none",color:"inherit",display:"block"}}>
                <motion.div variants={fade} className="service-card-interactive" style={{background:"white",borderRadius:18,overflow:"hidden",boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)",position:"relative",height:"100%"}}>
                  {/* Image Section */}
                  <div className="svc-card-img" style={{height:220,position:"relative",overflow:"hidden"}}>
                    <Image src={s.image} alt={s.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit:"cover",transition:"transform 0.6s ease"}} className="svc-img" />
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"}} />
                    <div style={{position:"absolute",bottom:16,left:24,width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.2rem",border:"1px solid rgba(255,255,255,0.3)"}}>
                      <i className={`fas ${s.icon}`}/>
                    </div>
                  </div>
                  {/* Text Content */}
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
            <span className="text-accent">How It Works</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>The 4-Step Journey</h2>
          </motion.div>
          <motion.div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24,marginTop:40}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {step:"01",title:"Discovery Profile",desc:"We evaluate your academic background, interests and aspirations.",icon:"fa-user-graduate"},
              {step:"02",title:"Strategic Roadmap",desc:"We shortlist universities and map required tests like IELTS/TOEFL.",icon:"fa-map-marked-alt"},
              {step:"03",title:"Application & SOP",desc:"We meticulously build your portfolio and craft compelling essays.",icon:"fa-pen-fancy"},
              {step:"04",title:"Visa & Pre-Departure",desc:"We secure your visa and prepare you for life in a new country.",icon:"fa-passport"},
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
            <span className="text-accent">Success Stories</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>What Parents & Students Say</h2>
          </motion.div>
          <motion.div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28,marginTop:32}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {name:"Aarav Sharma",role:"Admitted to NYU",text:"Ria completely transformed my application. Her insights on my SOP made all the difference."},
              {name:"Mrs. Kapoor",role:"Parent",text:"We were overwhelmed with the UK visa process. Ria handled everything smoothly and professionally."},
              {name:"Simran Kaur",role:"IELTS Band 8",text:"The structured mock interviews and writing evaluations helped me score far above my target."},
            ].map((t,i)=>(
              <motion.div key={i} variants={fade} style={{background:"white",padding:30,borderRadius:16,borderLeft:"4px solid var(--color-soft-teal)",boxShadow:"var(--shadow-soft)"}}>
                <i className="fas fa-quote-left" style={{fontSize:"1.8rem",color:"rgba(62,159,168,0.18)"}}/>
                <p style={{marginTop:12,fontStyle:"italic",color:"var(--text-secondary)",lineHeight:1.75,fontSize:"0.95rem"}}>"{t.text}"</p>
                <h4 style={{marginTop:18,color:"var(--color-deep-teal)",marginBottom:4,fontFamily:"var(--font-heading)",fontWeight:800}}>{t.name}</h4>
                <span style={{fontSize:"0.8rem",color:"var(--text-secondary)"}}>{t.role}</span>
              </motion.div>
            ))}
          </motion.div>
          <div style={{textAlign:"center",marginTop:36}}>
            <Link href="/testimonials" className="btn btn-outline">Read All Success Stories</Link>
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
              <span className="text-accent">Live Events</span>
              <h2 style={{fontSize:"clamp(1.8rem,3vw,2.3rem)",color:"var(--color-deep-teal)",marginBottom:18,fontFamily:"var(--font-heading)",fontWeight:800}}>Upcoming Masterclasses</h2>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:26,lineHeight:1.8}}>Join our free online masterclasses where we break down the Ivy League admission process, IELTS strategies, and profile-building secrets.</p>
              <div style={{background:"var(--bg-primary)",padding:20,borderRadius:12,marginBottom:22,borderLeft:"4px solid var(--color-soft-teal)"}}>
                <h4 style={{color:"var(--color-deep-teal)",marginBottom:6,fontFamily:"var(--font-heading)",fontWeight:800}}>Mastering the Common App</h4>
                <p style={{fontSize:"0.9rem",color:"#666",margin:0}}><i className="far fa-calendar-alt"/> August 15th, 2026 &nbsp;|&nbsp; <i className="far fa-clock"/> 6:00 PM IST</p>
              </div>
              <Link href="/contact" className="btn btn-primary">Register for Free</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS (Moved here) */}
      <section style={{background:"var(--color-deep-teal)",color:"white",padding:"60px 0"}}>
        <div className="container">
          <motion.div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:30,textAlign:"center"}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[{v:"500+",l:"Students Placed"},{v:"1500+",l:"Top Universities"},{v:"160+",l:"Career Paths"},{v:"98%",l:"Success Rate"}].map((s,i)=>(
              <motion.div key={i} variants={fade}>
                <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",color:"#F0C987",margin:"0 0 6px",fontFamily:"var(--font-heading)",fontWeight:800}}>{s.v}</h2>
                <p style={{fontSize:"1rem",opacity:0.9,margin:0}}>{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT FOUNDER (Moved here) */}
      <section style={{background:"var(--bg-primary)",padding:"80px 0"}}>
        <div className="container">
          <div className="flex-section" style={{display:"flex",flexWrap:"wrap",gap:50,alignItems:"center"}}>
            <motion.div style={{flex:"1 1 300px",position:"relative"}} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <Image src="/images/ria_portrait.jpg" alt="Ria Jain – Founder & Lead Counsellor" width={500} height={600} style={{width:"100%",height:"auto",borderRadius:20,boxShadow:"0 25px 50px rgba(0,0,0,0.15)"}} />
              <div className="founder-badge" style={{position:"absolute",bottom:-20,right:-20,background:"var(--color-deep-teal)",color:"white",padding:"16px 24px",borderRadius:16,boxShadow:"0 15px 30px rgba(0,0,0,0.15)",border:"1px solid var(--color-accent-gold)"}}>
                <span className="font-cursive" style={{fontSize:"1.8rem",color:"var(--color-accent-gold)",display:"block",lineHeight:1}}>Ria Jain</span>
                <p style={{margin:"4px 0 0",fontSize:"0.72rem",fontFamily:"var(--font-sans)",textTransform:"uppercase",letterSpacing:"1.5px",opacity:0.9}}>Lead Counsellor & Founder</p>
              </div>
            </motion.div>
            <motion.div style={{flex:"1 1 300px"}} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <span className="text-accent font-sans">About Us</span>
              <h2 style={{fontSize:"clamp(2.2rem,4vw,3.2rem)",color:"var(--color-deep-teal)",marginBottom:18,fontFamily:"var(--font-heading)",fontWeight:600}}>
                Guiding You <span className="text-highlight">Beyond Borders</span>
              </h2>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:16,lineHeight:1.8}}>Sometimes, all we need is the right guidance at the right time. That's why My Skill Counsellor was founded in 2023—to be a trusted guide, helping individuals navigate important academic and career decisions with clarity and confidence.</p>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:28,lineHeight:1.8}}>As both a counsellor and a parent of an international student myself, I bring professional expertise and real-world understanding. Every student has a different story, pace, and aspiration.</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
                {["MA English Degree","EduMilestones Certified","CCCIS Certified","USA / UK / Canada Visa Certified","Parent of Int'l Student"].map((b,i)=>(
                  <span key={i} style={{padding:"6px 14px",borderRadius:20,background:"rgba(62,159,168,0.1)",color:"var(--color-deep-teal)",fontSize:"0.82rem",fontWeight:700,fontFamily:"var(--font-heading)",display:"inline-flex",alignItems:"center",gap:6}}>
                    <i className="fas fa-certificate" style={{color:"var(--color-soft-teal)",fontSize:"0.75rem"}}/>
                    {b}
                  </span>
                ))}
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <Link href="/contact" className="btn btn-outline" style={{display:"inline-flex",alignItems:"center",gap:10}}>Book a Chat <i className="fas fa-arrow-right"/></Link>
                <Link href="https://www.linkedin.com/in/riajain26" target="_blank" style={{color:"var(--color-deep-teal)",fontWeight:700,fontSize:"0.9rem",display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}>
                  <i className="fab fa-linkedin" style={{fontSize:"1.2rem",color:"#0077b5"}}/> Verify on LinkedIn
                </Link>
              </div>
            </motion.div>
          </div>

          {/* CERTIFICATIONS GRID */}
          <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} style={{marginTop:60,background:"white",padding:36,borderRadius:20,boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)"}}>
            <div style={{textAlign:"center",marginBottom:30}}>
              <span className="text-accent">Verified Credentials</span>
              <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"var(--color-deep-teal)",margin:"6px 0 0"}}>Certifications & Professional Qualifications</h3>
            </div>
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>
              {[
                {
                  title: "Certified Career Counsellor",
                  org: "EduMilestones",
                  desc: "Certified in psychometric assessment, career planning & stream selection for Class 9-12 and graduates.",
                  icon: "fa-certificate",
                  link: "https://www.linkedin.com/in/riajain26/details/certifications/",
                  linkText: "Verify on LinkedIn",
                  isLinkedIn: true
                },
                {
                  title: "CCCIS Certified",
                  org: "Career Counselling & Int'l Studies",
                  desc: "Specialized certification in global university admissions, program mapping, and country-specific guidance.",
                  icon: "fa-user-check",
                  link: "https://www.linkedin.com/in/riajain26/details/certifications/",
                  linkText: "Verify on LinkedIn",
                  isLinkedIn: true
                },
                {
                  title: "MA English Degree",
                  org: "Master's Degree",
                  desc: "Advanced qualification ensuring high-level SOP/LOR writing, narrative drafting & verbal mentorship.",
                  icon: "fa-graduation-cap",
                  link: "https://drive.google.com/file/d/1nCf-64QLptZQfCwG85Z34-1mBKPnfoyx/view?usp=sharing",
                  linkText: "View Certificate Document",
                  isDrive: true
                },
                {
                  title: "Visa Training Certifications",
                  org: "USA, UK, Canada & Global",
                  desc: "Extensive training in student visa regulations, financial documentation, and embassy mock interviews.",
                  icon: "fa-passport",
                  link: "https://www.linkedin.com/in/riajain26/details/certifications/",
                  linkText: "Verify on LinkedIn",
                  isLinkedIn: true
                }
              ].map((cert, idx) => (
                <div key={idx} style={{background:"var(--bg-secondary)",padding:20,borderRadius:14,borderLeft:"4px solid var(--color-deep-teal)",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <i className={`fas ${cert.icon}`} style={{color:"var(--color-soft-teal)",fontSize:"1.1rem"}}/>
                      <h4 style={{margin:0,fontSize:"1rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800}}>{cert.title}</h4>
                    </div>
                    <span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-muted-coral)",textTransform:"uppercase",letterSpacing:"1px"}}>{cert.org}</span>
                    <p style={{fontSize:"0.85rem",color:"var(--text-secondary)",lineHeight:1.6,margin:"8px 0 0"}}>{cert.desc}</p>
                  </div>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:"0.8rem",color:cert.isLinkedIn ? "#0077b5" : "var(--color-soft-teal)",fontWeight:700,marginTop:14,textDecoration:"none"}}>
                      {cert.isLinkedIn && <i className="fab fa-linkedin" style={{fontSize:"0.9rem"}}/>}
                      {cert.isDrive && <i className="fas fa-file-pdf" style={{fontSize:"0.9rem"}}/>}
                      {cert.linkText} <i className="fas fa-external-link-alt" style={{fontSize:"0.75rem"}}/>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section style={{background:"var(--bg-secondary)",padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} style={{textAlign:"center",marginBottom:44}}>
            <span className="text-accent">Our Purpose</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>Vision & Mission</h2>
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:30}}>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}} style={{background:"white",padding:36,borderRadius:18,borderTop:"4px solid var(--color-deep-teal)",boxShadow:"var(--shadow-soft)"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(37,95,107,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-deep-teal)",fontSize:"1.4rem",marginBottom:20}}>
                <i className="fas fa-eye"/>
              </div>
              <h3 style={{fontSize:"1.4rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800,marginBottom:12}}>Our Vision</h3>
              <p style={{color:"var(--text-secondary)",lineHeight:1.8,fontSize:"1.02rem",margin:0}}>
                To inspire individuals to discover their potential, embrace opportunities, and create a future they truly believe in.
              </p>
            </motion.div>

            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:0.15}} style={{background:"white",padding:36,borderRadius:18,borderTop:"4px solid var(--color-soft-teal)",boxShadow:"var(--shadow-soft)"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(62,159,168,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-soft-teal)",fontSize:"1.4rem",marginBottom:20}}>
                <i className="fas fa-compass"/>
              </div>
              <h3 style={{fontSize:"1.4rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800,marginBottom:12}}>Our Mission</h3>
              <p style={{color:"var(--text-secondary)",lineHeight:1.8,fontSize:"1.02rem",margin:0}}>
                At My Skill Counsellor, we believe guidance doesn't begin in Class 12—it begins much earlier. Our mission is to walk alongside individuals and families at every stage of their journey, helping them discover their strengths, navigate opportunities, and make informed decisions with confidence, honesty, and purpose.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-sage-section" style={{padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} style={{textAlign:"center",marginBottom:44}}>
            <span className="text-accent">Principles That Guide Us</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>Our Core Values</h2>
          </motion.div>

          <motion.div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:24}} initial="hidden" whileInView="visible" viewport={{once:true}} variants={stag}>
            {[
              {
                title: "We Listen Before We Guide",
                desc: "Every journey is unique. We take the time to understand your aspirations, strengths, and concerns before we advise.",
                icon: "fa-comments"
              },
              {
                title: "Trust & Transparency",
                desc: "Honest advice, always in the individual's best interest. If a university isn't the right fit, we believe in being transparent rather than making false promises.",
                icon: "fa-handshake"
              },
              {
                title: "Beyond Academics",
                desc: "We believe success is shaped not only by marks, but also by skills, aspirations, values, and personal growth.",
                icon: "fa-graduation-cap"
              },
              {
                title: "Guidance for Life",
                desc: "Our role is not just to help people reach a destination, but to help them make confident decisions for their entire future.",
                icon: "fa-heart"
              }
            ].map((v, i) => (
              <motion.div key={i} variants={fade} style={{background:"white",padding:28,borderRadius:16,boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)"}}>
                <div style={{width:42,height:42,borderRadius:10,background:"rgba(37,95,107,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-deep-teal)",fontSize:"1.2rem",marginBottom:16}}>
                  <i className={`fas ${v.icon}`}/>
                </div>
                <h4 style={{fontSize:"1.15rem",color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800,marginBottom:10}}>{v.title}</h4>
                <p style={{color:"var(--text-secondary)",fontSize:"0.92rem",lineHeight:1.7,margin:0}}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES US UNIQUE */}
      <section style={{background:"var(--bg-primary)",padding:"80px 0"}}>
        <div className="container">
          <div className="flex-section" style={{display:"flex",flexWrap:"wrap",gap:50,alignItems:"center"}}>
            <motion.div style={{flex:"1 1 400px"}} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <span className="text-accent">Our Philosophy</span>
              <h2 style={{fontSize:"clamp(1.8rem,3.5vw,2.5rem)",color:"var(--color-deep-teal)",marginBottom:18,fontFamily:"var(--font-heading)",fontWeight:800}}>What Makes My Skill Counsellor Unique?</h2>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:16,lineHeight:1.8}}>
                At My Skill Counsellor, we believe that every individual deserves personalised guidance, not a one-size-fits-all approach. We consciously focus on <strong>quality over quantity</strong>, giving each student and family the time, attention, and support they truly deserve.
              </p>
              <p style={{fontSize:"1.05rem",color:"var(--text-secondary)",marginBottom:24,lineHeight:1.8}}>
                Our relationship doesn't begin with university applications, nor does it end with an admission letter. We walk alongside our students through every stage of their study abroad journey—from profile building, university selection, applications, visas, and pre-departure preparations to helping them settle into a new country.
              </p>
              <div style={{background:"rgba(62,159,168,0.08)",padding:20,borderRadius:14,borderLeft:"4px solid var(--color-soft-teal)"}}>
                <p style={{margin:0,fontSize:"0.95rem",color:"var(--color-deep-teal)",fontWeight:600}}>
                  <i className="fas fa-quote-left" style={{marginRight:8,color:"var(--color-soft-teal)"}}/>
                  Whether it's answering questions, easing concerns, or simply being there when guidance is needed, we strive to ensure that every student and parent feels supported, informed, and confident throughout the journey.
                </p>
              </div>
            </motion.div>

            <motion.div style={{flex:"1 1 350px"}} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <div style={{background:"var(--color-deep-teal)",color:"white",padding:36,borderRadius:20,boxShadow:"0 20px 40px rgba(0,0,0,0.15)"}}>
                <h3 style={{color:"#F0C987",fontFamily:"var(--font-heading)",fontWeight:800,marginBottom:20,fontSize:"1.4rem"}}>Guidance That Puts You First</h3>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:16}}>
                  {[
                    "Every recommendation begins with understanding the individual, not just the university.",
                    "We match aspirations, strengths, academic background, and career goals with right-fit institutions.",
                    "Every journey begins with an open, honest conversation.",
                    "No false promises—transparent advice you can depend on."
                  ].map((item, idx) => (
                    <li key={idx} style={{display:"flex",alignItems:"flex-start",gap:12,fontSize:"0.95rem",lineHeight:1.6,opacity:0.95}}>
                      <i className="fas fa-check-circle" style={{color:"#F0C987",fontSize:"1.1rem",flexShrink:0,marginTop:2}}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED CASE STUDY */}
      <section style={{background:"var(--bg-secondary)",padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} style={{textAlign:"center",marginBottom:44}}>
            <span className="text-accent">Student Success Story</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>Case Study: Navigating Multiple Offers</h2>
          </motion.div>

          <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"var(--shadow-soft)",border:"1px solid var(--border-color)",maxWidth:900,margin:"0 auto"}}>
            <div style={{background:"var(--color-deep-teal)",color:"white",padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
              <span style={{background:"rgba(255,255,255,0.15)",padding:"6px 16px",borderRadius:20,fontSize:"0.8rem",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"var(--font-heading)"}}>Case Study</span>
              <h3 style={{margin:0,fontSize:"1.25rem",color:"#F0C987",fontFamily:"var(--font-heading)",fontWeight:800}}>THREE OFFERS → THREE DIFFERENT PROGRAMS → ONE INFORMED DECISION</h3>
            </div>

            <div style={{padding:36,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:24}}>
              <div style={{background:"rgba(62,159,168,0.06)",padding:20,borderRadius:12}}>
                <span style={{fontSize:"0.8rem",fontWeight:800,color:"var(--color-soft-teal)",textTransform:"uppercase",letterSpacing:"1px"}}>The Student Goal</span>
                <p style={{margin:"8px 0 0",fontWeight:700,color:"var(--color-deep-teal)",fontSize:"1rem"}}>Find the right undergraduate business and marketing program in Dubai.</p>
              </div>

              <div style={{background:"rgba(240,201,135,0.15)",padding:20,borderRadius:12}}>
                <span style={{fontSize:"0.8rem",fontWeight:800,color:"#d49017",textTransform:"uppercase",letterSpacing:"1px"}}>The Outcome</span>
                <p style={{margin:"8px 0 0",fontWeight:700,color:"var(--color-deep-teal)",fontSize:"1rem"}}>3 admissions offers from top international universities.</p>
              </div>

              <div style={{background:"rgba(37,95,107,0.06)",padding:20,borderRadius:12,gridColumn:"1 / -1"}}>
                <span style={{fontSize:"0.8rem",fontWeight:800,color:"var(--color-deep-teal)",textTransform:"uppercase",letterSpacing:"1px"}}>Our Role</span>
                <p style={{margin:"8px 0 0",color:"var(--text-secondary)",lineHeight:1.7,fontSize:"0.95rem"}}>
                  Comprehensive university and program comparison, personalised counseling, and decision-making support based on the student's profile, career goals, and long-term direction.
                </p>
              </div>

              <div style={{background:"var(--bg-secondary)",padding:20,borderRadius:12,gridColumn:"1 / -1",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                <div>
                  <span style={{fontSize:"0.8rem",fontWeight:800,color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"1px"}}>The Next Step</span>
                  <p style={{margin:"4px 0 0",fontWeight:700,color:"var(--color-deep-teal)"}}>Choosing the exact university & program that best fits the student's future.</p>
                </div>
                <Link href="https://www.linkedin.com/posts/riajain26_studentsuccess-careercounselling-studyabroad-activity-7449459855624441856-BBZH" target="_blank" className="btn btn-outline" style={{fontSize:"0.85rem",padding:"8px 18px"}}>
                  Read Full Story on LinkedIn <i className="fab fa-linkedin" style={{marginLeft:6}}/>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MEDIA */}
      <section style={{padding:"80px 0",background:"var(--bg-secondary)"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} style={{textAlign:"center",marginBottom:44}}>
            <span className="text-accent" style={{color:"var(--color-soft-teal)"}}>In The Media</span>
            <h2 style={{color:"var(--color-deep-teal)",fontFamily:"var(--font-heading)",fontWeight:800}}>Recognized for Excellence</h2>
          </motion.div>
          <motion.div initial={{opacity:0,scale:0.96}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} style={{textAlign:"center",maxWidth:"800px",margin:"0 auto"}}>
            <div style={{width:"100%",position:"relative",borderRadius:16,boxShadow:"0 25px 50px rgba(0,0,0,0.15)",overflow:"hidden"}}>
              <Image src="/images/shah_times_article_cropped.jpg" alt="Shah Times Media Feature" width={630} height={350} style={{width:"100%",height:"auto",display:"block"}}/>
            </div>
            <p style={{marginTop:20,color:"var(--text-secondary)",fontStyle:"italic"}}>Shah Times Feature on Teenage Independence and Restrictions</p>
          </motion.div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="bg-sage-section" style={{padding:"80px 0"}}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade} style={{textAlign:"center",marginBottom:44}}>
            <span className="text-accent">Our Impact</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>Hear From Our Students</h2>
          </motion.div>
          <div style={{display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap"}}>
            <iframe src="https://www.youtube.com/embed/I9BAN9l69TU?si=Csheaq7O03RStyQO" title="Student testimonial 1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{width:"100%",maxWidth:420,aspectRatio:"16/9",borderRadius:14,boxShadow:"0 10px 30px rgba(0,0,0,0.1)",border:"none"}}/>
            <iframe src="https://www.youtube.com/embed/NcWqUKWeGfk?si=Lz1J9K3mUjwg2lpf" title="Student testimonial 2" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{width:"100%",maxWidth:420,aspectRatio:"16/9",borderRadius:14,boxShadow:"0 10px 30px rgba(0,0,0,0.1)",border:"none"}}/>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"80px 0",background:"var(--bg-secondary)"}}>
        <div className="container" style={{maxWidth:780,margin:"0 auto"}}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fade}>
            <span className="text-accent">Clarifications</span>
            <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800}}>Frequently Asked Questions</h2>
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
