import React, { useState } from 'react';
import { Card3 } from '~/ui';
import Linker from '~/components/Linker';

const Energies = function () {
  return (
    <>
      <Card3 style={{ marginTop: 10 }}>
        <main className="content-wrapper wf-section">
          <div className="w-container">
            <div className="energydisplay">
              <div className="div-block-32">
                <h1 className="heading-5 dark" style={{ width: '70%' }}>
                  Energies
                </h1>
                <div className="div-block-34">
                  <img
                    src="/images/61afe8550a1d064d4808f2b1_mana3.png"
                    loading="lazy"
                    sizes="(max-width: 479px) 57vw, (max-width: 767px) 180px, (max-width: 991px) 250px, 200px"
                    srcSet="/images/61afe8550a1d064d4808f2b1_mana3-p-500.png 500w, /images/61afe8550a1d064d4808f2b1_mana3.png 650w"
                    alt=""
                    className="image-16"
                  />
                  <img
                    src="/images/61c225b3c0c573e1cf313910_kona2_fixed.png"
                    loading="lazy"
                    sizes="120px"
                    srcSet="/images/61c225b3c0c573e1cf313910_kona2_fixed-p-500.png 500w, /images/61c225b3c0c573e1cf313910_kona2_fixed.png 703w"
                    alt=""
                    className="image-16 second"
                  />
                </div>
                <p className="paragraph white">
                  <Linker id="energies-1">
                    Energy is the lifeblood of both Haerra and the greater universe. The various types of energy flow
                    through all aspects of existence, enforcing a natural cycle of life, growth, and death. On Haerra,
                    many individuals harness energy to influence the world around them; whether it's healing the wounded
                    or conjuring violent maelstroms.
                  </Linker>
                  <br />
                  <br />
                  <Linker id="energies-2">
                    Ancients believed that the energies all stem from a single fount called Source Energy. Thought to be
                    too powerful and unstable for mortal use, Source Energy can be broken down into more predictable
                    'sub-energies' like Kona (sun) and Ichor (death). Though not without risk, these sub-energies can be
                    harnessed by mortals with the right training, talent, and circumstance. Only seven sub-types of
                    energy have been widely discovered so far, though many theorize that there could be more.
                  </Linker>
                </p>
                <div className="w-dyn-list">
                  <div role="list" className="collection-list-2 w-dyn-items">
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Source</h3>
                        <p className="paragraph-4">
                          An all-encompassing, powerful energy harnessed by the gods and the Arcane Sorcerers
                        </p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-3">
                                Source energy is the least understood of all the energies, and even the gods puzzle over
                                the source of this immense power. Source energy can be channeled into any other sub
                                energy and create any of their effects. Source energy taxes its users a great deal,
                                often rendering one bedridden after channeling it for a single instance. Source energy,
                                if used correctly, also has the unique ability to counter any other energy, for as long
                                as one has the stamina. Even the gods have barely scratched the surface of this
                                universal energy.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd7f6ded66643990bc6f2_source.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd7f6ded66643990bc6f2_source-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd7f6ded66643990bc6f2_source-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd7f6ded66643990bc6f2_source.png 1000w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Temporal</h3>
                        <p className="paragraph-4">Time energy harnessed by Zeno and the First Order of Zeno</p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-4">
                                Other than source energy itself, temporal energy is the least utilised and least
                                understood energy on Haerra. Its use only began recently, when Zeno gifted the secrets
                                of temporal energy to the First Order of Zeno. Users of temporal energy can manipulate
                                time by slowing it down or speeding it up in their vicinity, gaze into the future or
                                past, and predict enemy movements.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal-p-1080.png 1080w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal-p-1600.png 1600w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd80460f891fc747256c2_temporal.png 1869w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark remove-this">Chaos</h3>
                        <p className="paragraph-4">
                          Destructive energy harnessed by Azorag, the demonkin, and the Valburn Corruptors
                        </p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-5">
                                Although chaos is not innately evil, Azorag sees chaos as a vessel for destruction, and
                                he gifts it to his followers to cause just that. Users of chaos energy can do a vast
                                amount of things--more than any other energy besides source. However, chaos magic is
                                unstable and unreliable, and can end in the destruction of both target and user. Users
                                can tear at reality, confuse foes or drive them to madness, and outright disintegrate
                                enemies.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8183e878ff49b0d8055_chaos.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8183e878ff49b0d8055_chaos-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8183e878ff49b0d8055_chaos-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8183e878ff49b0d8055_chaos.png 1000w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Ichor</h3>
                        <p className="paragraph-4">
                          Necrotic energy harnessed by Isidor and a variety of necromancer groups
                        </p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-6">
                                Isidor is a vague figure; not only in form, but also in energy. Although many see ichor
                                energy in its villainous light--animating skeletons and corrupting nature--others argue
                                that ichor energy can be used for good: healing, restoring life, and speaking with
                                ancestors. Users of ichor can create undead, drain life to heal themselves, communicate
                                with the spirit world and, supposedly, even raise the dead.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd82d1a055c5634645d27_ichor.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd82d1a055c5634645d27_ichor-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd82d1a055c5634645d27_ichor-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd82d1a055c5634645d27_ichor.png 1000w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Gaia</h3>
                        <p className="paragraph-4">Nature energy harnessed by Metun and fay creatures</p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-7">
                                Gaia energy is more than just earth magic: it is the energy of life, growth, and natural
                                force. Users of gaia energy can both nurture and wilt the things they interact with,
                                create storms by controlling the winds, part the earth with ease, and heal allies in
                                times of need.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd83a03933b78cc7741a2_gaia.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd83a03933b78cc7741a2_gaia-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd83a03933b78cc7741a2_gaia-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd83a03933b78cc7741a2_gaia.png 1100w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Kona</h3>
                        <p className="paragraph-4">Sun energy harnessed by Relia and her followers</p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-8">
                                Although once subservient to astra energy, Relia broke her discipline away from Eledon
                                to focus on the nurturing and disciplinary properties of light. Users of kona energy can
                                wield fire in all its forms, create brilliant beacons of light to blind their enemies,
                                and increase their body temperatures to create immunity from the cold.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd84d5324e87b6b46f8cc_kona.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd84d5324e87b6b46f8cc_kona-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd84d5324e87b6b46f8cc_kona.png 559w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Mana</h3>
                        <p className="paragraph-4">Arcane energy harnessed by Walarah and the mages</p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-91">
                                Walarah's liberal provision of mana energy, somewhat ironically, inspires the most
                                serious and studious users. Since mana energy can be harnessed by anyone who seeks it,
                                scholars and mages spend their lives learning to harness this energy. Users of mana have
                                the greatest versatility of all the energies, although they often require components,
                                actions, and chants to create such varied magical effects.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8718f78c495e3905163_mana3.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8718f78c495e3905163_mana3-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd8718f78c495e3905163_mana3.png 650w"
                        />
                      </div>
                    </div>
                    <div role="listitem" className="grid-5 w-dyn-item">
                      <div className="div-block-41">
                        <h3 className="heading-6 dark">Astra</h3>
                        <p className="paragraph-4">Divine energy harnessed by Eledon and his followers</p>
                        <div className="div-block-33">
                          <div className="rich-text-block-6 w-richtext">
                            <p>
                              <Linker id="energies-10">
                                Astra energy embodies the celestial heights and the divine purge of all things: a
                                consuming light determined to wash over the entire universe. Users of astra are able to
                                manipulate light and shield themselves with barriers of glowing protective energy. More
                                powerful users can fly and channel burning divine energy into beams of destructive
                                power.
                              </Linker>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item-bg-1 darkbg twntyfive">
                        <img
                          height={210}
                          loading="lazy"
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd87eff609504c46c8a66_astra.png"
                          alt=""
                          sizes="(max-width: 479px) 29vw, (max-width: 767px) 30vw, (max-width: 991px) 31vw, 33vw"
                          srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61afd87eff609504c46c8a66_astra-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd87eff609504c46c8a66_astra-p-800.png 800w, https://assets.website-files.com/618ec26aa362f88cee86d122/61afd87eff609504c46c8a66_astra.png 1000w"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Card3>
    </>
  );
};

export default Energies;
