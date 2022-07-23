import React from 'react';
import Tabs from "./Tabs"
import styled from "@emotion/styled"
import { css } from "@emotion/css"


const TabsNavigation = () => {
    return (
        <div className={css`
        padding: 4rem 15rem;

        @media (max-width: 767.98px) {
          padding: 2rem 1rem;
        }
        `}>
            <h3 className={css`
                font-family: 'Josefin Sans', sans serif;
                font-size: clamp(30px, 4vw, 40px);
                text-transform: uppercase;
                font-weight: 700;
                color: #3B4754;
                margin-bottom: 5rem;
                padding-left: 15rem;

                @media (max-width: 767.98px) {
                  padding-left: 2rem;
                }
            `}> Where I&apos;ve worked</h3>
        <Tabs>
            <div title="Katana">
              <h3>Software Engineer @Katana</h3>
              <h5>Aug 2018 - Present</h5>
              <p>
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
              </p>
            </div>
            <div title="Optimaplay OU">
              <h3>Software Engineer @Optimaplay OU</h3>
              <h5>Aug 2018 - Present</h5>
              <p>
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
              </p>
            </div>
            <div title="Namespace">
              <h3>Software Engineer @Namespace</h3>
              <h5>Aug 2018 - Present</h5>
              <p>
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
              </p>
            </div>
            <div title="EveryPay">
              <h3>Software Engineer @EveryPay</h3>
              <h5>Aug 2018 - Present</h5>
              <p>
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
                The quick, brown fox jumps over a lazy dog. DJs flock by when
                MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog,
                flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex!
              </p>
            </div>
        </Tabs>
    </div>
    );
}

export default TabsNavigation;