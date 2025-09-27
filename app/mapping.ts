import type { Mapping } from '@graphprotocol/hypergraph/mapping';
import { Id } from '@graphprotocol/hypergraph';

export const mapping: Mapping = {
  Image: {
    typeIds: [Id("ba4e4146-0010-499d-a0a3-caaa7f579d0e")],
    properties: {
      url: Id("8a743832-c094-4a62-b665-0c3cc2f9c7bc")
    },
  },
  Project: {
    typeIds: [Id("484a18c5-030a-499c-b0f2-ef588ff16d50")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935"),
      description: Id("9b1f76ff-9711-404c-861e-59dc3fa7d037"),
      xUrl: Id("0d625978-4b3c-4b57-a86f-de45c997c73c")
    },
    relations: {
      avatar: Id("1155beff-fad5-49b7-a2e0-da4777b8792c")
    },
  },
  Dapp: {
    typeIds: [Id("8ca136d0-698a-4bbf-a76b-8e2741b2dc8c")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935"),
      description: Id("9b1f76ff-9711-404c-861e-59dc3fa7d037"),
      xUrl: Id("0d625978-4b3c-4b57-a86f-de45c997c73c"),
      githubUrl: Id("9eedefa8-60ae-4ac1-9a04-805054a4b094")
    },
    relations: {
      avatar: Id("1155beff-fad5-49b7-a2e0-da4777b8792c")
    },
  },
  Investor: {
    typeIds: [Id("331aea18-973c-4adc-8f53-614f598d262d")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935")
    },
  },
  FundingStage: {
    typeIds: [Id("8d35d217-3fa1-4686-b74f-fcb3e9438067")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935")
    },
  },
  InvestmentRound: {
    typeIds: [Id("8f03f4c9-59e4-44a8-a625-c0a40b1ff330")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935"),
      raisedAmount: Id("16781706-dd9c-48bf-913e-cdf18b56034f")
    },
    relations: {
      investors: Id("9b8a610a-fa35-486e-a479-e253dbdabb4f"),
      fundingStages: Id("e278c3d4-78b9-4222-b272-5a39a8556bd2"),
      raisedBy: Id("b4878d1a-0609-488d-b8a6-e19862d6b62f")
    },
  },
  Asset: {
    typeIds: [Id("f8780a80-c238-4a2a-96cb-567d88b1aa63")],
    properties: {
      name: Id("a126ca53-0c8e-48d5-b888-82c734c38935"),
      symbol: Id("ace1e96c-9b83-47b4-bd33-1d302ec0a0f5"),
      blockchainAddress: Id("56b5944f-f059-48d1-b0fa-34abe84219da")
    },
  },
  PostMetrics: {
    typeIds: [Id("a0dc92f9-d377-4016-afaa-af2ae6be1763")],
    properties: {
      claps: Id("8ce02df1-1f34-4b16-8dff-a81f68ca2113"),
      views: Id("608f4222-bc83-48d5-abb6-63e3ed0261e5"),
      comments: Id("e1091dab-2f1c-4e31-af68-ca5fadcdaea8"),
      shares: Id("f148aac4-24c2-426e-a21c-9886a67b3247")
    },
  },
  Author: {
    typeIds: [Id("6e9d39f5-008a-461e-a7f4-605d3a60f39e")],
    properties: {
      name: Id("969f24c7-674b-4d04-b7e3-bcdf30044f40"),
      username: Id("470bcb90-96c5-468e-9eb9-190399134ba5"),
      profileUrl: Id("52c3f676-fb62-4445-bc79-ffa8c75520bc")
    },
  },
  PostData: {
    typeIds: [Id("07063815-8f46-4b10-b1a9-3e6ba8422a0a")],
    properties: {
      postId: Id("0d34bde2-a1a6-4db1-bd96-4680920cf23a"),
      title: Id("344fba2c-a0ff-433a-baac-a53dc6940271"),
      content: Id("bf9d6e58-8a75-4958-a99d-37b56f258816"),
      excerpt: Id("e3d6aa11-b36b-42c8-ae40-b09a4bb13dd0"),
      url: Id("48f66f18-af64-4fa4-8b1b-b1ab495aab68"),
      publishedAt: Id("73c21268-38ad-4915-8a8c-b7cb71c4d901"),
      tags: Id("28b5671d-650e-4a78-a789-f12739e0a0c8"),
      featuredImage: Id("cc2e40de-e847-470c-a95f-ca9dad9f9688"),
      readingTime: Id("3ce0af87-774d-4ee3-8dd9-35e37d90fe44")
    },
    relations: {
      author: Id("bcc4861e-f340-4b08-98e8-90a39af83d2c"),
      metrics: Id("7e9bc7bc-764b-4086-b734-03c935de2671")
    },
  },
  Paragraph: {
    typeIds: [Id("729b0683-1021-4992-8e7e-d9b351beacda")],
    properties: {
      companyName: Id("d3a302c4-b6fd-4c7e-aac5-a85a916e0021"),
      platform: Id("bee469a4-f8ec-48b8-b179-a309c33afa08")
    },
    relations: {
      postData: Id("34b81c74-a1e2-4732-9802-d262e48e491f")
    },
  },
  AcademicField: {
    typeIds: [Id("7470a81a-e5b3-4872-916d-6dfd887689f8")],
    properties: {
      description: Id("c2fc2d16-879f-4e76-8ee0-7b1c388f1123"),
      name: Id("dfcf94b5-80af-492c-9bc8-ea05a7400cf0")
    },
  },
}