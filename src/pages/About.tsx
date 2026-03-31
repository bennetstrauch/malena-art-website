import { useState } from "react";
import { useTranslation } from "react-i18next";
import TabSelector from "../components/TabSelector";
import BioSection from "../components/BioSection";
import HeadshotImage from "../assets/web/about_Headshot+2024.jpg";
import GoldenGapImage from "../assets/web/about_the+golden+gap.jpg";
import FullnessImage from "../assets/web/about+statement_fullness.jpg";
import TranscendingImage from "../assets/web/about+statement_transcending+space.jpg";
import WaldstrukturImage from "../assets/web/about+statement_waldstruktur.jpg";

const TAB_BIO = "bio";
const TAB_STATEMENT = "statement";

export default function About() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(TAB_BIO);

  return (
    <div className="px-6 py-0 max-w-5xl mx-auto">
      <TabSelector
        tabs={[TAB_BIO, TAB_STATEMENT]}
        labels={[t("about.bioTab"), t("about.statementTab")]}
        selectedTab={selectedTab}
        onSelect={setSelectedTab}
      />

      {selectedTab === TAB_BIO ? (
        <>
          <BioSection
            imageSrc={HeadshotImage}
            imageAlt={t("about.headshotAlt")}
            text={t("about.bioFirst")}
            imageLeft={true}
          />
          <BioSection
            imageSrc={GoldenGapImage}
            imageAlt={t("about.goldenGapAlt")}
            text={t("about.bioSecond")}
            imageLeft={false}
          />
        </>
      ) : (
        <>
          <BioSection
            imageSrc={WaldstrukturImage}
            imageAlt={t("about.waldstrukturAlt")}
            text={t("about.statementFirst")}
            imageLeft={true}
          />

          <BioSection
            imageSrc={TranscendingImage}
            imageAlt={t("about.transcendingAlt")}
            text={t("about.statementSecond")}
            imageLeft={false}
          />

          <BioSection
            imageSrc={FullnessImage}
            imageAlt={t("about.fullnessAlt")}
            text={t("about.statementThird")}
            imageLeft={true}
          />
        </>
      )}
    </div>
  );
}
