// src/pages/About.tsx
import { useState } from "react";
import TabSelector from "../components/TabSelector";
import BioSection from "../components/BioSection";
import HeadshotImage from "../assets/web/about_Headshot+2024.jpg";
import GoldenGapImage from "../assets/web/about_the+golden+gap.jpg";
import FullnessImage from "../assets/web/about+statement_fullness.jpg";
import TranscendingImage from "../assets/web/about+statement_transcending+space.jpg";
import WaldstrukturImage from "../assets/web/about+statement_waldstruktur.jpg";


const tabs = ["Bio", "Artist Statement"];

const fullBio = `Malena Strauch (b. 2001, Rosenheim, Germany) is a visual artist based in Fairfield, Iowa. Her paintings explore the intersection of natural landscapes and architectural structures, creating spaces that feel both grounded and dreamlike. She draws from real-life observation, photographs, memories, and imagination to build layered compositions that blur the line between reality and abstraction.

Strauch earned her BFA summa cum laude from Maharishi International University in 2024, where she was Valedictorian and received the Outstanding Student Award in Art. She is currently pursuing her MA in Studio Art at MIU, with her thesis exhibition scheduled for June 2025 at the Wege Gallery.`;

const [bioFirst, bioSecond] = fullBio.split("between reality and abstraction.");

// const statement = `In my current work, I explore the merging of nature and architecture, weaving together organic landscapes with built structures in ways that feel both familiar and surreal. I’m drawn to the tension between these worlds and enjoy creating scenes that feel grounded yet dreamlike, inviting questions about space, boundaries, and perception.

// Rather than painting real places, I construct my own spaces from fragments of photographs, my surroundings, memories, and imagination. I layer and distort these elements until they become something new — spaces that feel suspended between memory and presence. Through shifts in formal elements such as shape, color, and perspective, I change the rhythm of the painting and encourage the viewer to move through the painting intuitively, sometimes with a sense of disorientation.

// My process is flexible — I work mostly with acrylic and oil on canvas, sometimes focusing on a single piece, and other times moving between multiple works in progress. This back-and-forth approach allows ideas to pass from one painting to another.`;

// const [statementFirst, statementSecond, statementThird] = statement.split(
//   /(?<=Rather.*?)\n+|(?<=My process.*?)\n+/s
// );
const statementFirst = `In my current work, I explore the merging of nature and architecture, weaving together organic landscapes with built structures in ways that feel both familiar and surreal. I’m drawn to the tension between these worlds and enjoy creating scenes that feel grounded yet dreamlike, inviting questions about space, boundaries, and perception.`;

const statementSecond = `Rather than painting real places, I construct my own spaces from fragments of photographs, my surroundings, memories, and imagination. I layer and distort these elements until they become something new — spaces that feel suspended between memory and presence. Through shifts in formal elements such as shape, color, and perspective, I change the rhythm of the painting and encourage the viewer to move through the painting intuitively, sometimes with a sense of disorientation.`;

const statementThird = `My process is flexible — I work mostly with acrylic and oil on canvas, sometimes focusing on a single piece, and other times moving between multiple works in progress. This back-and-forth approach allows ideas to pass from one painting to another.`;


export default function About() {
  const [selectedTab, setSelectedTab] = useState("Bio");

  return (
    <div className="px-6 py-0 max-w-5xl mx-auto">
      <TabSelector tabs={tabs} selectedTab={selectedTab} onSelect={setSelectedTab} />

      {selectedTab === "Bio" ? (
        <>
          <BioSection
            imageSrc={HeadshotImage}
            imageAlt="Headshot of Malena Strauch"
            text={bioFirst.trim() + "between reality and abstraction."}
            imageLeft={true}
          />
          <BioSection
            imageSrc={GoldenGapImage}
            imageAlt="The Golden Gap Painting"
            text={bioSecond.trim()}
            imageLeft={false}
          />
        </>
      ) : (
        <>
          <BioSection
            imageSrc={WaldstrukturImage}
            imageAlt="Waldstruktur - Painting"
            text={statementFirst.trim()}
            imageLeft={true}
          />

          <BioSection
            imageSrc={TranscendingImage}
            imageAlt="Transcending Space - Painting"
            text={statementSecond.trim()}
            imageLeft={false}
          />

          <BioSection
            imageSrc={FullnessImage}
            imageAlt="Fullness"
            text={statementThird.trim()}
            imageLeft={true}
          />
        </>
      )}
    </div>
  );
}

