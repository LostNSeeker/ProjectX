"use client"

import React from "react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-primary font-medium">
          Better every day
        </span>
        <h3 className="text-4xl md:text-6xl font-semibold text-foreground">
          Let's change it up a bit
        </h3>
        <p className="text-base md:text-lg text-muted-foreground my-4 md:my-6">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nobis in
          error repellat voluptatibus ad.
        </p>
        <button className={cn(
          "bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md",
          "transition-all hover:bg-primary/90 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}>
          Find a class
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

// Helper function to get company logo - returns URL or SVG component
const getCompanyLogo = (companyName: string): { type: 'url' | 'svg'; src?: string; svg?: React.ReactNode } => {
  const normalizedName = companyName.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/the/g, '');
  
  // Special cases with direct URLs
  const directLogoMap: { [key: string]: string } = {
    'front': 'https://cdn-public.softwarereviews.com/production/logos/offerings/9196/original/FrontApp_logo.png?1729284940',
    'statsig': 'https://www.statsig.com/images/statsig_full.svg',
    'remote': 'https://cdn.asp.events/CLIENT_Informa__AADDE28D_5056_B739_5481D63BF875B0DF/sites/london-tech-week-2024/media/Remote-Logo.png',
    'clipboardhealth': 'https://cdn.prod.website-files.com/6331fdb067d0d2e7fcce41d8/63d7e4dcc375a62efe51e399_bunnylogo.png',
    'anrok': 'https://cdn.prod.website-files.com/632add85afcd1ac30aa74675/6357842d130e1f3e0e23d1fe_anrok_logo.svg',
    'mavenclinic': 'https://cdn.prod.website-files.com/5fb2b678e994739660d95086/68128420e1f9aec4f84cd81c_img-maven-true-green-logo.svg',
    'citadelsecurities': 'https://www.ir-impact.com/wp-content/uploads/2024/11/Logo_Citadel.png',
    'glean': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/66ded1bc82df72f2e1d56eb7_Glean%20Logomark%20Blue.svg',
  };
  
  if (directLogoMap[normalizedName]) {
    return {
      type: 'url' as const,
      src: directLogoMap[normalizedName]
    };
  }
  
  // Special cases with SVG logos
  if (normalizedName === 'rippling') {
    return {
      type: 'svg',
      svg: (
        <svg viewBox="0 0 128 20" className="w-full h-full" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.878 4.99C2.878 3.01 1.875 1.374 0 0h4.358a6.26 6.26 0 012.467 4.99 6.26 6.26 0 01-2.467 4.99c1.415.59 2.22 2.03 2.22 4.091v3.927H2.632v-3.927c0-1.963-.937-3.337-2.631-4.09 1.875-1.375 2.878-3.01 2.878-4.99zm8.552 0c0-1.98-1.003-3.616-2.878-4.99h4.359a6.26 6.26 0 012.466 4.99 6.26 6.26 0 01-2.466 4.99c1.414.59 2.22 2.03 2.22 4.091v3.927h-3.947v-3.927c0-1.963-.938-3.337-2.632-4.09 1.875-1.375 2.878-3.01 2.878-4.99zm8.554 0c0-1.98-1.003-3.616-2.878-4.99h4.358a6.26 6.26 0 012.467 4.99 6.26 6.26 0 01-2.467 4.99c1.415.59 2.22 2.03 2.22 4.091v3.927h-3.947v-3.927c0-1.963-.937-3.337-2.631-4.09 1.875-1.375 2.878-3.01 2.878-4.99zM35.952 14.728H32.96V3.272h7.352c3.536 0 5.279 1.31 5.279 3.453 0 1.456-.855 2.552-2.45 3.109 1.644.245 2.384 1.112 2.384 2.667v2.225h-3.026v-2.094c0-1.31-.658-1.833-2.385-1.833h-4.16v3.929zm4.194-9.787h-4.194v4.19h4.161c1.513 0 2.45-.835 2.45-2.144 0-1.293-.87-2.046-2.417-2.046zM50.787 3.272h-2.993v11.456h2.993V3.272zM59.964 10.995h-3.651v3.731h-2.994V3.272h6.71c3.536 0 5.395 1.473 5.395 3.83 0 2.437-1.891 3.893-5.46 3.893zm-.066-6.054h-3.585v4.385h3.552c1.546 0 2.5-.785 2.5-2.208 0-1.391-.954-2.177-2.467-2.177zM73.845 10.995h-3.651v3.731H67.2V3.272h6.71c3.536 0 5.395 1.473 5.395 3.83 0 2.437-1.892 3.893-5.46 3.893zm-.066-6.054h-3.585v4.385h3.552c1.546 0 2.5-.785 2.5-2.208 0-1.391-.954-2.177-2.467-2.177zM84.074 3.272v9.752h7.467v1.704h-10.46V3.272h2.993zM96.407 3.272h-2.993v11.456h2.993V3.272zM100.914 7.101v7.627H98.94V3.272h2.239l8.157 7.625V3.272h1.974v11.456h-2.237L100.914 7.1zM121.08 4.614c-2.846 0-4.704 1.8-4.704 4.483 0 2.65 1.776 4.287 4.539 4.287h.197c.938 0 1.99-.197 2.961-.507V9.784h-4.835V8.148H127v5.383c-1.611.835-4.046 1.49-6.019 1.49h-.263c-4.54 0-7.467-2.39-7.467-5.859 0-3.436 3.01-6.184 7.631-6.184h.263c1.925 0 4.128.605 5.757 1.554l-.856 1.39c-1.463-.801-3.207-1.308-4.769-1.308h-.197z" />
        </svg>
      )
    };
  }
  
  // Trade Republic SVG
  if (normalizedName === 'traderepublic') {
    return {
      type: 'svg',
      svg: (
        <svg viewBox="0 0 210.521 20" className="w-full h-full" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M210.521 9.082v5.707h-.002l-.006.01a.562.562 0 0 1-.412.552l-7.823 2.01a1.179 1.179 0 0 1-.706-.03l-3.412-1.21a1.18 1.18 0 0 0-.706-.03l-7.515 1.944c-.283.072-.569-.117-.639-.421a.713.713 0 0 1-.014-.132v-5.707c0-.265.171-.493.412-.553l7.764-2.01c.232-.06.476-.052.706.03l3.418 1.204c.23.079.474.09.706.03l7.577-1.947c.283-.072.571.114.638.42a.638.638 0 0 1 .014.133Zm-.005-8.514v5.717a.562.562 0 0 1-.412.552l-7.817 2.008a1.179 1.179 0 0 1-.706-.03l-3.419-1.202a1.18 1.18 0 0 0-.706-.03l-7.514 1.944c-.283.072-.569-.117-.639-.42a.714.714 0 0 1-.014-.133V3.258c0-.264.171-.493.412-.55l7.764-2.01c.232-.06.476-.051.706.03l3.418 1.205c.23.078.474.09.706.03l7.568-1.948c.283-.072.572.115.639.421a.714.714 0 0 1 .014.132ZM170.004 16.64c1.195.705 2.589 1.057 4.181 1.057 1.357 0 2.56-.264 3.608-.793 1.049-.528 1.886-1.261 2.509-2.2.624-.946.99-2.028 1.1-3.246h-3.895a3.645 3.645 0 0 1-.583 1.54c-.3.433-.689.767-1.166 1.002-.469.234-1.001.352-1.595.352-.807 0-1.504-.198-2.091-.594-.579-.404-1.023-.968-1.331-1.695-.308-.733-.462-1.588-.462-2.563 0-.895.154-1.713.462-2.454.315-.74.763-1.328 1.342-1.76.587-.433 1.276-.65 2.069-.65.594 0 1.118.114 1.573.341.462.228.836.55 1.122.969.294.418.503.917.627 1.496h3.884c-.176-1.232-.586-2.31-1.232-3.235a6.5 6.5 0 0 0-2.52-2.145c-1.026-.514-2.196-.77-3.509-.77-1.578 0-2.957.352-4.137 1.056a7.1 7.1 0 0 0-2.729 2.927c-.638 1.24-.957 2.648-.957 4.225 0 1.57.322 2.978.968 4.225a7.142 7.142 0 0 0 2.762 2.915ZM13.782 1.56v15.867H17.7v-5.953h1.232l3.191 5.953h4.357l-3.564-6.349a4.37 4.37 0 0 0 1.639-.99 4.328 4.328 0 0 0 1.023-1.573 5.491 5.491 0 0 0 .352-1.992c0-1.005-.212-1.878-.638-2.619-.425-.748-1.045-1.324-1.86-1.727-.806-.41-1.767-.616-2.882-.616h-6.767Zm7.614 6.537c-.418.322-.931.484-1.54.484h-2.157V4.608h2.102c.403 0 .77.066 1.1.198.33.124.598.333.803.627.213.293.32.682.32 1.166 0 .668-.21 1.166-.628 1.497ZM59.55 1.56v15.866h10.585V14.18h-6.712v-3.367h5.766V7.942h-5.766V4.806h6.712V1.56H59.55ZM27.022 17.426l5.48-15.866h4.83l5.48 15.866h-4.193l-.935-3.092H32.15l-.936 3.092h-4.192Zm5.975-5.997h3.85l-1.254-4.07a69.17 69.17 0 0 1-.627-2.256h-.088c-.22.814-.433 1.566-.638 2.255l-1.243 4.071Zm10.956-9.87v15.867h5.59c1.715 0 3.182-.334 4.4-1.001 1.218-.668 2.138-1.596 2.762-2.784.623-1.188.935-2.564.935-4.126 0-1.562-.312-2.941-.935-4.137-.624-1.203-1.544-2.138-2.762-2.806-1.218-.675-2.684-1.012-4.4-1.012h-5.59Zm7.8 12.148c-.63.389-1.378.583-2.244.583h-1.738V4.696h1.727c.866 0 1.614.201 2.245.605.638.396 1.126.957 1.463 1.683.345.726.517 1.57.517 2.53 0 .955-.169 1.794-.506 2.52a3.832 3.832 0 0 1-1.463 1.673Zm26.328 3.725V1.566h6.766c1.115 0 2.076.205 2.883.616.814.403 1.434.98 1.86 1.727.425.741.638 1.614.638 2.619 0 .719-.118 1.383-.352 1.991a4.328 4.328 0 0 1-1.024 1.574c-.454.44-1 .77-1.64.99l3.566 6.349H86.42l-3.191-5.953h-1.232v5.953H78.08Zm6.073-8.846c.609 0 1.122-.162 1.54-.485.419-.33.628-.829.628-1.496 0-.484-.107-.873-.32-1.166a1.69 1.69 0 0 0-.803-.627 2.938 2.938 0 0 0-1.1-.199h-2.101v3.972h2.156Zm8.152-7.02v15.866h10.585v-3.246h-6.712v-3.367h5.766V7.947h-5.766V4.812h6.712V1.566H92.306Zm12.228 15.866V1.566h6.481c1.232 0 2.281.209 3.147.627.873.41 1.533.997 1.98 1.76.455.756.682 1.65.682 2.685 0 1.027-.227 1.925-.682 2.696-.447.77-1.107 1.368-1.98 1.793-.873.418-1.922.627-3.147.627h-2.597v5.678h-3.884Zm6.118-8.692c.484 0 .898-.077 1.243-.232a1.82 1.82 0 0 0 .814-.704c.198-.315.297-.704.297-1.166 0-.47-.095-.855-.286-1.155a1.634 1.634 0 0 0-.814-.671c-.352-.147-.77-.22-1.254-.22h-2.234V8.74h2.234Zm10.679 8.197c.982.498 2.189.748 3.619.748 1.438 0 2.645-.25 3.62-.748.976-.5 1.706-1.207 2.19-2.124.491-.917.737-2.002.737-3.257v-9.99h-3.917v9.737c0 1.05-.216 1.83-.649 2.344-.433.506-1.093.759-1.981.759-.902 0-1.569-.253-2.002-.76-.433-.513-.649-1.294-.649-2.343V1.566h-3.917v9.99c0 1.247.246 2.333.737 3.257.491.917 1.229 1.625 2.212 2.124Zm12.629.49V1.56h7.195c.932 0 1.743.18 2.432.54.697.351 1.229.835 1.595 1.452a3.88 3.88 0 0 1 .562 2.057c0 .499-.085.961-.253 1.387a3.388 3.388 0 0 1-.727 1.11 3.541 3.541 0 0 1-1.1.76v.022a4.081 4.081 0 0 1 1.529.88c.426.382.749.833.969 1.354.22.513.33 1.074.33 1.683 0 .866-.198 1.65-.594 2.355a4.29 4.29 0 0 1-1.673 1.661c-.726.403-1.577.605-2.552.605h-7.713Zm6.436-2.95c.433 0 .811-.077 1.134-.23.33-.155.583-.382.759-.683.183-.308.275-.678.275-1.111 0-.41-.092-.76-.275-1.045a1.652 1.652 0 0 0-.759-.65c-.323-.154-.701-.23-1.134-.23h-2.563v3.95h2.563Zm-.341-6.502c.404 0 .752-.07 1.045-.21.294-.139.518-.34.672-.604.161-.265.242-.584.242-.958s-.085-.69-.253-.946a1.433 1.433 0 0 0-.694-.583 2.44 2.44 0 0 0-1.012-.198h-2.222v3.499h2.222Zm8.594-6.41v15.867h10.123v-3.29h-6.206V1.566h-3.917Zm11.832 15.878V1.577h3.917v15.866h-3.917ZM4.302 17.426V4.828H0V1.56h12.488v3.268H8.186v12.598H4.302Z" />
        </svg>
      )
    };
  }
  
  // Harvey SVG
  if (normalizedName === 'harvey') {
    return {
      type: 'svg',
      svg: (
        <svg viewBox="0 0 22.3009 20" className="w-full h-full" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.3009 20H12.3242L15.2585 17.059V11.7648H7.04238V17.059L9.97671 20H0L2.93433 17.059V2.9413L0 0H9.97671L7.04238 2.9413V8.23536H15.2585V2.9413L12.3242 0H22.3009L19.3666 2.9413V17.059L22.3009 20Z" />
        </svg>
      )
    };
  }
  
  // Map company names to their actual domains
  const companyLogoMap: { [key: string]: string } = {
    'openai': 'openai.com',
    'glean': 'glean.com',
    'harvey': 'harvey.ai',
    'statsig': 'statsig.com',
    'front': 'front.com',
    'chainguard': 'chainguard.dev',
    'citadelsecurities': 'citadelsecurities.com',
    'traderepublic': 'traderepublic.com',
    'remote': 'remote.com',
    'rippling': 'rippling.com',
    'klarna': 'klarna.com',
    'nubank': 'nubank.com.br',
    'anrok': 'anrok.com',
    'clipboardhealth': 'clipboardhealth.com',
    'mavenclinic': 'mavenclinic.com',
    'getir': 'getir.com',
    'faire': 'faire.com',
    'boringcompany': 'boringcompany.com',
    'meter': 'meter.com',
    'amprobotics': 'amprobotics.com',
    'watershed': 'watershed.com',
    'starkware': 'starkware.co',
    'wonolo': 'wonolo.com',
    'recroom': 'recroom.com',
    'uipath': 'uipath.com',
    'knowde': 'knowde.com',
    'doordash': 'doordash.com',
    'airbnb': 'airbnb.com',
    'figma': 'figma.com',
    'robinhood': 'robinhood.com',
    'snowflake': 'snowflake.com',
    'databricks': 'databricks.com',
    'instacart': 'instacart.com',
    'stripe': 'stripe.com',
    'linear': 'linear.app',
    'vercel': 'vercel.com',
    'notion': 'notion.so',
    'gong': 'gong.io',
    'replicate': 'replicate.com',
    'huggingface': 'huggingface.co',
    'bolt': 'bolt.com',
    'wolt': 'wolt.com',
    'monzo': 'monzo.com',
    'unity': 'unity.com',
    'xai': 'x.ai',
    'mistralai': 'mistral.ai',
    'pinecone': 'pinecone.io',
    'anyscale': 'anyscale.com',
    'baseten': 'baseten.co',
    'together': 'together.ai',
    'cybersyn': 'cybersyn.com',
    'temporal': 'temporal.io',
    'captions': 'captions.ai',
    'bridge': 'bridge.xyz',
    'layerzerolabs': 'layerzero.network',
    'blockaid': 'blockaid.io',
    'caldera': 'caldera.xyz',
    'tiplink': 'tiplink.io',
    'turnkey': 'turnkey.com',
    'wiz': 'wiz.io',
    'island': 'island.io',
    'cyera': 'cyera.io',
    'semgrep': 'semgrep.dev',
    'warp': 'warp.dev',
    'rockset': 'rockset.com',
    'cortex': 'cortex.io',
    'dagsterlabs': 'dagster.io',
    'blueswireless': 'blues.io',
    'collaborativerobotics': 'collaborativerobotics.com',
    'hextechnologies': 'hex.tech',
    'caresync': 'caresync.com',
    'two': 'two.app',
    'oso': 'oso.sh',
    'closefactor': 'closefactor.com',
    'atlys': 'atlys.com',
    'lightmetrics': 'lightmetrics.co',
    'rever': 'rever.com',
    'machindustries': 'machindustries.com',
    'iambictherapeutics': 'iambictx.com',
    'apollo': 'apollo.io',
    'profound': 'profound.io',
    'agency': 'agency.co',
    'rillet': 'rillet.com',
    'aspora': 'aspora.com',
    'cresta': 'cresta.ai',
  };
  
  // Check if we have a direct mapping
  const domain = companyLogoMap[normalizedName];
  if (domain) {
    return {
      type: 'url' as const,
      src: `https://logo.clearbit.com/${domain}`
    };
  }
  
  // Fallback: try common domain patterns
  const fallbackDomains = [
    `${normalizedName}.com`,
    `${normalizedName}.io`,
    `${normalizedName}.ai`,
    `${normalizedName}.co`,
    `${normalizedName}.app`,
  ];
  
  return {
    type: 'url' as const,
    src: `https://logo.clearbit.com/${fallbackDomains[0]}`
  };
};

const companies = [
  "OpenAI", "Glean", "Harvey", "Statsig", "Front", "Chainguard", "Citadel Securities",
  "Trade Republic", "Remote", "Rippling", "Klarna", "Nubank", "Anrok", "Clipboard Health",
  "Maven Clinic", "Pendulum Therapeutics", "Getir", "Faire", "Reflect Orbital",
  "Mach Industries", "The Boring Company", "Meter", "AMP Robotics", "Watershed", "Joro",
  "StarkWare", "mmhmm", "Wonolo", "Rec Room", "UiPath", "Knowde", "DoorDash", "Airbnb",
  "Figma", "Robinhood", "Snowflake", "Databricks", "Instacart", "Stripe", "FTX", "Close",
  "Linear", "Vercel", "Notion", "Gong", "Replicate", "Hugging Face", "Tavus", "Dust",
  "Blockaid", "Breeze.cash", "Caldera", "Bolt", "Wolt", "Monzo", "Graphiant", "JuiceBox",
  "N8n", "OpenEvidence", "Crosby", "Anterior", "Apex", "Bunkerhill Health", "Pinecone",
  "Weaviate", "Mistral AI", "Anyscale", "Baseten", "Together AI", "Cybersyn", "Temporal Technologies",
  "Captions", "Bridge", "LayerZero Labs", "TipLink", "Turnkey", "CoinCRED", "Upway",
  "Wiz", "Island", "Cyera", "Semgrep", "Warp", "Rockset", "Cortex", "Dagster Labs",
  "Blues Wireless", "Collaborative Robotics", "Hex Technologies", "Caresync", "Two", "Oso",
  "CloseFactor", "Atlys", "ChatGPT Tips", "Lightmetrics", "REVER", "Rartogo", "Meeno",
  "Squint", "Iambic Therapeutics", "Apollo.io", "Unity", "xAI", "Profound", "Agency",
  "Rillet", "Aspora", "Cresta"
];

const squareData = companies.slice(0, 16).map((company, index) => ({
  id: index + 1,
  name: company,
  logo: getCompanyLogo(company),
}));

const generateSquares = () => {
  return shuffle([...squareData]).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-md overflow-hidden bg-white flex items-center justify-center p-2 sm:p-4 relative"
    >
      {sq.logo.type === 'svg' ? (
        <div className="w-full h-full flex items-center justify-center text-gray-900">
          {sq.logo.svg}
        </div>
      ) : (
        <img 
          src={sq.logo.src} 
          alt={sq.name}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Try alternative logo source using Simple Icons or other service
            const normalizedName = sq.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
            const altSrc = `https://cdn.simpleicons.org/${normalizedName}/000000`;
            
            if (!target.dataset.retried) {
              target.dataset.retried = 'true';
              target.src = altSrc;
            } else {
              // If both fail, show company name
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-text')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-text text-xs sm:text-sm font-bold text-gray-700 text-center px-2';
                fallback.textContent = sq.name;
                parent.appendChild(fallback);
              }
            }
          }}
        />
      )}
    </motion.div>
  ));
};

export const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<React.ReactNode[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSquares(generateSquares());
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
        {squareData.map((sq) => (
          <div
            key={sq.id}
            className="w-full h-full rounded-md overflow-hidden bg-white flex items-center justify-center p-2 sm:p-4 relative"
          >
            <div className="text-xs sm:text-sm font-bold text-gray-700 text-center px-2">{sq.name}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};
