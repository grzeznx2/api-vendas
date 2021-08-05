interface IMailConfig {
  driver: 'ethereal' | 'ses'
  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'grzeznx2@apivendas.waw.pl',
      name: 'Grzegorz',
    },
  },
} as IMailConfig
