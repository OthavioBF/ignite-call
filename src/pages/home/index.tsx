import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'
import appPreview from '../../assets/app-preview.png'

import { Container, Hero, Preview } from './styles'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
      </Hero>
      <Preview>
        <Image src={appPreview} height={400} quality={100} priority alt="" />
      </Preview>
    </Container>
  )
}