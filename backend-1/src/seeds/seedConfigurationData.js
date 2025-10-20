/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Configuration = require('../models/configuration')
const User = require('../models/user')

const seedConfiguration = async () => {
  try {
    console.log('🌱 Seeding configuration...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const configExists = await Configuration.exists({})
    if (configExists) {
      console.log('ℹ️  Configuration already exists. Skipping seed.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    // 🔥 CRITICAL: Create Map for Ports
    const portsMap = new Map()

    // Define all ports
    const portsData = {
      XD1: {
        type: 'PWRIN',
        descr: 'M12, L-coded, 4-Pin, male',
        capabilities: '9 A',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: 'autoneg',
          speed: 1000000
        }
      },
      XD2: {
        type: 'PWROUT',
        descr: 'M12, L-coded, 4-Pin, female',
        capabilities: '9 A',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: 'autoneg',
          speed: 1000000
        }
      },
      XF1: {
        type: 'ETH',
        descr: 'M12, D-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      XF2: {
        type: 'ETH',
        descr: 'M12, D-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100HD',
          speed: 1000000
        }
      },
      X0: {
        type: 'IOL',
        descr: 'M12, A-coded female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X1: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X2: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X3: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X4: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X5: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X6: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      },
      X7: {
        type: 'IOL',
        descr: 'M12, A-coded, female',
        capabilities: '100-BaseTX',
        configuration: {
          configuration: 'enabled',
          adminstate: 'enabled'
        },
        status: {
          mode: '100FD',
          speed: 1000000
        }
      }
    }

    // 🔥 Populate Map
    Object.entries(portsData).forEach(([key, value]) => {
      portsMap.set(key, value)
    })

    const configuration = new Configuration({
      Fieldbus: {
        fieldbusStatus: 'connected',
        fieldbusProtocol: 'PROFINET',
        addressing: 'active',
        ipAddress: '192.168.100.10',
        subnetMask: '255.255.255.0',
        standardGateway: '192.168.1.254'
      },

      MQTT: {
        clientMode: 'active',
        ipAddress: '192.168.2.1',
        serverAddress: '192.168.2.1/mqttbroker',
        username: 'iolink_json',
        password: '1234',
        lastwill: {
          topic: 'process_data',
          message: 'Process data transfer stopped.',
          qos: '0_ONLY_ONCE',
          retain: 'true'
        },
        keepAliveTime: 10
      },

      Ports: portsMap, // 🔥 Use Map instead of object

      JSON: {
        json_configuration: {
          json: 'true'
        }
      },

      SNTP: {
        SNTP_client_parameter_settings: {
          IP_addresse_of_the_NTP_server: '0.0.0.0',
          IP_address_of_the_NTP_fallback_server: '0.0.0.0'
        }
      },

      UserManagement: {
        Users: [
          {
            username: 'admin',
            firstname: 'admin',
            lastname: 'admin',
            role: 'admin',
            lastIp: '192.168.1.1'
          },
          {
            username: 'main',
            firstname: 'main',
            lastname: 'main',
            role: 'maintenance',
            lastIp: '192.168.1.1'
          },
          {
            username: 'op',
            firstname: 'op',
            lastname: 'op',
            role: 'operator',
            lastIp: '192.168.1.1'
          }
        ]
      },

      user: user._id
    })

    await configuration.save()
    console.log('✅ Configuration with all sections seeded successfully.')

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// Run the seed function
seedConfiguration()