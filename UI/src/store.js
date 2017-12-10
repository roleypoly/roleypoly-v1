import { observable, computed } from 'mobx'

class Store {
  @observable servers = [
    {
      "id": "203493697696956418",
      "gm": {
        "nickname": "sexkittenhime",
        "color": "#ff5c00"
      },
      "server": {
        "id": "203493697696956418",
        "name": "Genudine Medkit Manufacturing",
        "ownerID": "62601275618889728",
        "icon": "ff08d36f5aee1ff48f8377b65d031ab0"
      },
      "perms": {
        "isAdmin": true,
        "canManageRoles": true
      }
    },
    {
      "id": "386659935687147521",
      "gm": {
        "nickname": null,
        "color": "#cca1a1"
      },
      "server": {
        "id": "386659935687147521",
        "name": "Roleypoly",
        "ownerID": "62601275618889728",
        "icon": "4fa0c1063649a739f3fe1a0589aa2c03"
      },
      "perms": {
        "isAdmin": true,
        "canManageRoles": true
      }
    }
  ]

  @observable user = {
    username: 'あたし',
    discriminator: '0001',
    id: '',
    avatar: null
  }

}

export default Store
