import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import Linker from '~/components/Linker';
import { Skeleton, Card3 } from '~/ui';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node';

const zzz = styled.div``;

const Faction = function ({ id }) {
  // const url = `https://s1.envoy.arken.asi.sh/characterFactions.json`
  // const { data } = useFetch(url)

  // const factions = data?.[url] || []
  const { data: faction } = trpc.seer.character.getCharacterFaction.useQuery<Arken.Character.Types.CharacterFaction>(
    {}
  );

  const { t } = useTranslation();

  if (!faction)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Card3 style={{ marginTop: 10 }}>
      <div className="w-embed">
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\n      .table2 {\n        width: 100%;\n        text-align: left;\n      }\n\n      .table2 tbody tr:nth-child(odd) {\n        background-color: rgba(255, 255, 255, 0.2);\n      }\n\n      .table2 td,\n      .table2 th {\n        padding-right: 10px;\n        padding-left: 10px;\n        padding-top: 10px;\n        padding-bottom: 10px;\n      }\n    ',
          }}
        />
      </div>
      <main className="content-wrapper body-5 lore wf-section">
        <div className="class-header">
          <div className="w-layout-grid grid-class-header" style={{ alignItems: 'start', margin: '32px' }}>
            <div className="div-block-46">
              <h1 className="page-title act-title">{faction.name}</h1>
              <div className="w-richtext">
                {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.description}</ReactMarkdown> */}
                <Linker id="faction-1">{faction.description}</Linker>
              </div>
              <br />
              <br />
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.meta.lore1}</ReactMarkdown>
              </div>
              <br />
              <br />
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.meta.lore2}</ReactMarkdown>
              </div>
              <br />
              <br />
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.meta.lore3}</ReactMarkdown>
              </div>
            </div>
            <div style={{ marginBottom: 20, marginTop: 60 }}>
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.meta.lore4}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="container class-container w-container">
          <div className="w-layout-grid class-layout">
            <div>
              <div className="w-richtext">
                <h2 id="class-features">Class Features</h2>
                <p>As a hierophant, you gain the following class features.</p>
                <h3 id="hitpoints">HitPoints</h3>
                <p>
                  **Hit Dice:** 1d8 per hierophant level <br />
                  **Hit Points at 1st Level:** 8 + your Constitution modifier <br />
                  **Hit Points at Higher Levels:** 1d8 (or 5) + yourConstitution modifier per hierophant level after 1st{' '}
                </p>
                <h3 id="proficiencies">Proficiencies</h3>
                <p>
                  **Armor:** Light armor, medium armor, shields <br />
                  **Weapons:** Simple weapons <br />
                  **Tools:** None <br />
                  **Saving Throws:** Wisdom, Charisma <br />
                  **Skills:** Choose two from History, Insight, Medicine, Persuasion, and Religion{' '}
                </p>
                <h3 id="equipment">Equipment</h3>
                <p>You start with the following equipment, in addition to the equipment granted by your background:</p>
                <ul>
                  <li>(a) a mace or (b) a warhammer (if proficient)</li>
                  <li>(a) scale mail, (b) leather armor, or (c) chain mail (if proficient)</li>
                  <li>(a) a light crossbow and 20 bolts or (b) any simple weapon</li>
                  <li>(a) a priest’s pack or (b) an explorer’s pack</li>
                  <li>A shield and a holy symbol</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="w-richtext">
                <h2 id="spellcasting">Spellcasting</h2>
                <p>As a conduit for divine power, you can cast hierophant spells.</p>
                <h3 id="cantrips">Cantrips</h3>
                <p>
                  You know three cantrips of your choice from the hierophants pell list. You learn additional hierophant
                  cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Hierophant
                  table.
                </p>
                <h3 id="spell-slots">Spell Slots</h3>
                <p>
                  <em>Table: The Hierophant</em> shows how many spell slots you have.The table also shows what the level
                  of those slots is; all of your spell slots are the same level. To cast one of your hierophant spells
                  of 1st level or higher, you must expend a spell slot. You regain all expended spell slots when you
                  finish a short or long rest.For example, when you are 5th level, you have two 3rd-level spell slots.
                </p>
                <div className="framecontainer2 center">
                  {' '}
                  To cast the 1st-level spell cure wounds, you must spend one of those slots, and you cast it as a
                  3rd-level spell{' '}
                </div>{' '}
                ### How to customize formatting for each rich text At 1st level, you know two 1st-level spells of your
                choice from the hierophant spell list.The Spells Known column of Table: The Hierophant shows when you
                learn more hierophant spells of your choice of 1st level and higher. A spell you choose must be of a
                level no higher than what’s shown in the table’s Slot Level column for your level. When you reach 6th
                level, for example, you learn anew hierophant spell, which can be 1st, 2nd, or 3rd level.Additionally,
                when you gain a level in this class, you can choose one of the hierophant spells you know and replace it
                with another spell from the hierophant spell list, which also must be of a level for which you have
                spell slots.
              </div>
            </div>
          </div>
          <div className="sidescroll-richtext">
            <div className="w-richtext">
              <h2 id="the-tale-of-a-sample-table">The tale of a sample table</h2>
              <p>
                The barbarians have been known across continents to be one of the dumbest races. So one day, a wizard
                came to them and proposed a challenge. Create an HTML table, make it nice, display your abilities on it.
                The barbarians got excited, and came up with the following table, written in their own implementation of
                HTML called HTBL, Hypertext Barbarian Language.
              </p>
              <div className="framecontainer2">
                <table className="table2">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Proficiency Bonus</th>
                      <th>Features</th>
                      <th>Cantrips Known</th>
                      <th>Spells Known</th>
                      <th>Spell Slots</th>
                      <th>Slot Level</th>
                      <th>Benedictions Known</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1st</th>
                      <td>+1</td>
                      <td>Spellcasting, Divine Domain</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1st</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <th>1st</th>
                      <td>+1</td>
                      <td>Spellcasting, Divine Domain</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1st</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <th>1st</th>
                      <td>+1</td>
                      <td>Spellcasting, Divine Domain</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1st</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <th>1st</th>
                      <td>+1</td>
                      <td>Spellcasting, Divine Domain</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1st</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <th>1st</th>
                      <td>+1</td>
                      <td>Spellcasting, Divine Domain</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1st</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-richtext">
            <h2 id="donec-sed-diam-odio-">Donec sed diam odio.</h2>
            <p>
              Donec lacinia eu ipsum eget mattis. Nullam a neque in velit iaculis pharetra in at massa. Quisque non
              tortor feugiat, dapibus justo eu, egestas arcu. Suspendisse consectetur nisl dictum lacus tempus, vitae
              gravida metus viverra. Integer tempor velit leo, sed pellentesque lorem tempor id.
            </p>
            <h4 id="lorem-ipsum">Lorem Ipsum</h4>
            <p>Eros molestie vehicula mollis, lacus urna placerat odio, sit amet maximus arcu justo a lorem.</p>
            <h4 id="lorem-ipsum">Lorem Ipsum</h4>
            <p>Eros molestie vehicula mollis, lacus urna placerat odio, sit amet maximus arcu justo a lorem.</p>
          </div>
        </div>
      </main>
    </Card3>
  );
};

export default Faction;
